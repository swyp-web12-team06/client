'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function CallbackComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const handleLogin = async () => {
      try {
        // 소셜 로그인 후 전달된 isNewUser 파라미터는 서버의 OAuth2SuccessHandler에서 설정합니다.
        // 클라이언트는 이 페이지에서 AuthContext의 login 함수를 호출하여 토큰을 재발급받고 사용자 정보를 가져옵니다.
        // 이 login 함수는 내부적으로 completeAuthentication를 호출하여 refresh token으로 access token을 얻습니다.
        await login();

        const isNewUser = searchParams.get('isNewUser');

        if (isNewUser === 'true') {
          router.push('/?signup=true'); // 신규 유저이면 홈페이지로 이동하여 회원가입 모달 표시
        } else {
          router.push('/'); // 기존 유저이면 홈페이지로 이동
        }
      } catch (error) {
        console.error('Login failed during callback process:', error);
        // 로그인 실패 시, 홈페이지로 리다이렉트하거나 오류 메시지를 표시할 수 있습니다.
        router.push('/');
      }
    };

    handleLogin();
  }, [router, searchParams, login]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg">Processing login...</p>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-lg">Loading...</p>
        </div>
      }
    >
      <CallbackComponent />
    </Suspense>
  );
}
