"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";

interface User {
    id: number;
    nickname?: string;
    email?: string;
    profileImageUrl?: string;
    role: string;
}

interface AuthContextType {
    isLoggedIn: boolean;
    accessToken: string | null;
    user: User | null;
    login: () => Promise<{ isNewUser: boolean; role: string; userId: number }>;
    logout: () => void;
    isLoading: boolean;
    setUserInfo: (userInfo: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeJwt(token: string): any {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Failed to decode JWT:", e);
        return null;
    }
}

const apiClient = {
    get: async function <T>(path: string, token: string): Promise<T> {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        };
        const response = await fetch(`/api${path}`, {
            method: "GET",
            headers: headers,
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }
        return response.json();
    },
    post: async function <T>(path: string, token?: string): Promise<T> {
        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        const response = await fetch(`/api${path}`, {
            method: "POST",
            headers: headers,
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }
        return response.json();
    },
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchUser = useCallback(async function (token: string) {
        try {
            const response = await apiClient.get<{ data: User }>("/user/me", token);
            setUser(response.data);
        } catch (error) {
            console.error(error);
            setAccessToken(null);
            setUser(null);
        }
    }, []);

    const reissueTokenAndFetchUser = useCallback(async function (): Promise<{ isNewUser: boolean; role: string; userId: number }> {
        setIsLoading(true);
        try {
            const response = await apiClient.post<{ data: { accessToken: string; isNewUser: boolean; role: string } }>("/auth/reissue");
            const { accessToken: newAccessToken, isNewUser, role } = response.data;
            setAccessToken(newAccessToken);

            const decodedToken = decodeJwt(newAccessToken);
            const userId = parseInt(decodedToken.sub);

            if (role !== 'GUEST') {
                await fetchUser(newAccessToken);
            } else {
                setUser({ id: userId, role: 'GUEST' });
            }

            return { isNewUser, role, userId };
        } catch (error) {
            setAccessToken(null);
            setUser(null);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [fetchUser]);

    useEffect(() => {
        reissueTokenAndFetchUser().catch(() => {
            // 초기 재발행은 새로 고침 토큰이 없으면 실패할 수 있으며, 이는 정상입니다.
            // 오류는 reissueTokenAndFetchUser에서 처리됩니다.
        });
    }, [reissueTokenAndFetchUser]);

    const login = useCallback(async function (): Promise<{ isNewUser: boolean; role: string; userId: number }> {
        return await reissueTokenAndFetchUser();
    }, [reissueTokenAndFetchUser]);

    const logout = useCallback(async function () {
        if (accessToken) {
            try {
                await apiClient.post("/auth/logout", accessToken);
            } catch (error) {
                console.error(error);
            }
        }
        setAccessToken(null);
        setUser(null);
        router.push("/");
    }, [accessToken, router]);

    const setUserInfo = (newUserInfo: Partial<User>) => {
        if (user) {
            setUser({ ...user, ...newUserInfo });
        }
    };

    const value = {
        isLoggedIn: !!accessToken && !!user,
        accessToken,
        user,
        login,
        logout,
        isLoading,
        setUserInfo,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth는 반드시 AuthProvider에서 사용되어야 합니다.");
    }
    return context;
};

