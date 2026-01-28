'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function CallbackComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 서버의 OAuth2SuccessHandler에서 보내준 isNewUser 쿼리 파라미터를 사용합니다.
    const isNewUser = searchParams.get('isNewUser');

    if (isNewUser === 'true') {
      router.push('/signup'); // 신규 유저이면 회원가입 페이지로 이동
    } else {
      router.push('/'); // 기존 유저이면 홈페이지로 이동
    }
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg">Processing login...</p>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><p className="text-lg">Loading...</p></div>}>
      <CallbackComponent />
    </Suspense>
  );
}
