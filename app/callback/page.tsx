"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function CallbackPage() {
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleLogin = async () => {
      try {
        await login();
      } catch (error) {
        console.error('Error occurred while processing login:', error);
      } finally {
        // 성공하든 실패하든 홈으로 리디렉션
        router.push('/');
      }
    };

    handleLogin();
  }, [login, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Processing login...</p>
    </div>
  );
}
