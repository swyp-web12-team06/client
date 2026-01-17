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
  login: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
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

  const fetchUser = useCallback(async function (token: string) {
    // 토큰에서 정보 추출
    const decodedToken = decodeJwt(token);
    if (decodedToken) {
      // 'sub' 클레임 = userId, 'role' 클레임 = 사용자 역할
      const userId = parseInt(decodedToken.sub);
      const role = decodedToken.role;

      setUser({
        id: userId,
        role: role,
        nickname: `User${userId}`, // 임시 닉네임
        email: `user${userId}@example.com`, // 임시 이메일
        profileImageUrl: "/icon/user.svg" // 기본 프로필 이미지
      });
      // 추후에 사용자 정보를 백엔드에서 받아오도록 수정 필요
    } else {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  const reissueTokenAndFetchUser = useCallback(async function () {
    setIsLoading(true);
    try {
      const response = await apiClient.post<{ data: { accessToken: string } }>("/auth/reissue");
      const newAccessToken = response.data.accessToken;
      setAccessToken(newAccessToken);
      // 토큰에서 유저 정보 추출
      await fetchUser(newAccessToken); // fetchUser를 호출하여 토큰 디코딩 및 user 상태 업데이트
    } catch (error) {
      setAccessToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [fetchUser]); // fetchUser가 변경될 때 reissueTokenAndFetchUser도 변경되도록

  useEffect(() => {
    reissueTokenAndFetchUser();
  }, [reissueTokenAndFetchUser]);

  const login = useCallback(async function () {
    await reissueTokenAndFetchUser();
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

  const value = {
    isLoggedIn: !!accessToken && !!user,
    accessToken,
    user,
    login,
    logout,
    isLoading,
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
