'use client';

import { Button } from '@/components/commons/Button';

interface LoginViewProps {
  handleSocialLogin: (provider: 'google' | 'naver' | 'kakao') => void;
}

export default function LoginView({ handleSocialLogin }: LoginViewProps) {
  return (
    <>
      <div className="text-center">
        <h2 className="text-2xl font-bold">소셜 로그인</h2>
      </div>
      <div className="mt-8 flex flex-col justify-center space-y-4">
        <Button
          className="bg-red-300 text-gray-800 hover:bg-red-400"
          onClick={() => handleSocialLogin('google')}
        >
          Google 계정으로 로그인
        </Button>
        <Button
          className="bg-green-300 text-gray-800 hover:bg-green-400"
          onClick={() => handleSocialLogin('naver')}
        >
          네이버 계정으로 로그인
        </Button>
        <Button
          className="bg-yellow-300 text-gray-800 hover:bg-yellow-400"
          onClick={() => handleSocialLogin('kakao')}
        >
          카카오 계정으로 로그인
        </Button>
      </div>
    </>
  );
}
