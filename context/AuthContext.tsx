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
    login: () => Promise<{ isNewUser: boolean; role: string; userId: number }>; // Changed return type
    logout: () => void;
    isLoading: boolean;
    setUserInfo: (userInfo: User) => void;
}

// --- 컨텍스트 생성 ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- JWT 디코딩 헬퍼 함수 ---
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

// --- API 함수 ---
const apiClient = {
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
            throw new Error(error.message || "API 요청 실패");
        }
        return response.json();
    },
};

// --- AuthProvider 컴포넌트 ---
export function AuthProvider({ children }: { children: ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchUser = useCallback(async function (userId: number, role: string) {
        setUser({
            id: userId,
            role: role,
            nickname: undefined,
            email: undefined,
            profileImageUrl: "/icon/user.svg"
        });
    }, []);

    const reissueTokenAndFetchUser = useCallback(async function (): Promise<{ isNewUser: boolean; role: string; userId: number }> {
        setIsLoading(true);
        try {
            const response = await apiClient.post<{ data: { accessToken: string; isNewUser: boolean; role: string } }>("/auth/reissue");
            const { accessToken: newAccessToken, isNewUser, role } = response.data;
            setAccessToken(newAccessToken);

            const decodedToken = decodeJwt(newAccessToken);
            const userId = parseInt(decodedToken.sub);

            await fetchUser(userId, role);

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
        reissueTokenAndFetchUser().catch(error => console.error("Initial reissue failed:", error));
    }, [reissueTokenAndFetchUser]);

    const login = useCallback(async function (): Promise<{ isNewUser: boolean; role: string; userId: number }> {
        return await reissueTokenAndFetchUser();
    }, [reissueTokenAndFetchUser]);

    const logout = useCallback(async function () {
        if (!accessToken) return; // accessToken이 없으면 로그아웃 API 호출 방지
        try {
            await apiClient.post("/auth/logout", accessToken);
        } catch (error) {
            console.error("로그아웃 API 호출에 실패했습니다.", error);
        } finally {
            // API 호출 성공 여부와 관계없이 프론트엔드 상태를 초기화하고 홈으로 리디렉션
            setAccessToken(null);
            setUser(null);
            router.push("/");
        }
    }, [accessToken, router]);

    const setUserInfo = (newUserInfo: User) => {
        setUser(newUserInfo);
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

// --- useAuth 커스텀 훅 ---
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
