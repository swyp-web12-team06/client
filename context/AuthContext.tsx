'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { httpClient } from '@/lib/api';
import { decodeJwt } from '@/utils/auth';

interface User {
  id: number;
  nickname?: string;
  email?: string;
  profileImageUrl?: string;
  bio?: string;
  creditBalance?: number;
  role: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  accessToken: string | null;
  user: User | null;
  login: () => Promise<{ isNewUser: boolean; role: string; userId: number }>;
  loginDev: () => Promise<{ isNewUser: boolean; role: string; userId: number }>;
  logout: () => void;
  isLoading: boolean;
  setUserInfo: (userInfo: User) => void;
  reissueToken: () => Promise<{ isNewUser: boolean; role: string; userId: number }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async function (token: string) {
    try {
      const response = await httpClient.get<{ data: User }>('/user/me', token);
      setUser(response.data);
    } catch (error) {
      console.error(error);
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  const processAuthentication = useCallback(
    async (
      tokenPromise: Promise<{ data: { accessToken: string; isNewUser: boolean; role: string } }>,
    ): Promise<{ isNewUser: boolean; role: string; userId: number }> => {
      setIsLoading(true);
      try {
        const response = await tokenPromise;
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
        console.error('Authentication process failed:', error);
        setAccessToken(null);
        setUser(null);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchUser],
  );

  const completeAuthentication = useCallback(
    async function (): Promise<{ isNewUser: boolean; role: string; userId: number }> {
      return processAuthentication(httpClient.post('/auth/reissue'));
    },
    [processAuthentication],
  );

  useEffect(() => {
    completeAuthentication().catch(() => {
      // 초기 재발행은 새로 고침 토큰이 없으면 실패할 수 있으며, 이는 정상입니다.
      // 오류는 processAuthentication에서 처리됩니다.
    });
  }, [completeAuthentication]);

  const login = useCallback(
    async function (): Promise<{ isNewUser: boolean; role: string; userId: number }> {
      return await completeAuthentication();
    },
    [completeAuthentication],
  );

  const loginDev = useCallback(async (): Promise<{
    isNewUser: boolean;
    role: string;
    userId: number;
  }> => {
    return processAuthentication(httpClient.get('/dev/token?userId=2&role=SELLER'));
  }, [processAuthentication]);

  const logout = useCallback(
    async function () {
      if (accessToken) {
        try {
          await httpClient.post('/auth/logout', accessToken);
        } catch (error) {
          console.error(error);
        }
      }
      setAccessToken(null);
      setUser(null);
      router.push('/');
    },
    [accessToken, router],
  );

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
    loginDev,
    logout,
    isLoading,
    setUserInfo,
    reissueToken: completeAuthentication,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth는 반드시 AuthProvider에서 사용되어야 합니다.');
  }
  return context;
};
