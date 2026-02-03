'use client';

import { Button } from '@/components/commons/Button';
import Image from 'next/image';
import Link from 'next/link';

interface LoginViewProps {
  handleSocialLogin: (provider: 'google' | 'naver' | 'kakao') => void;
}

export default function LoginView({ handleSocialLogin }: LoginViewProps) {
  return (
    <>
      <div className="mt-12 mb-15 flex flex-col-reverse justify-center gap-4">
        <Button
          onClick={() => handleSocialLogin('google')}
          variant="outline"
          size="sm"
          prefixIcon={<Image src="/icon/google.svg" alt="Google icon" width={24} height={24} />}
        >
          <span className="typo-body1-semibold text-gray-800">Google로 로그인하기</span>
        </Button>
        <Button
          onClick={() => handleSocialLogin('naver')}
          variant="outline"
          size="sm"
          prefixIcon={<Image src="/icon/naver.svg" alt="Naver icon" width={24} height={24} />}
        >
          <span className="typo-body1-semibold text-gray-800">Naver로 로그인하기</span>
        </Button>
        <Button
          onClick={() => handleSocialLogin('kakao')}
          variant="outline"
          size="sm"
          prefixIcon={<Image src="/icon/kakao.svg" alt="Kakao icon" width={24} height={24} />}
        >
          <span className="typo-body1-semibold text-gray-800">Kakao로 로그인하기</span>
        </Button>
      </div>
      <div className="max-w-66.25 flex justify-between gap-11 mx-auto">
        <span className="typo-body2-regular text-gray-600">로그인에 문제가 있으신가요?</span>
        <Link className="text-primary-200 typo-body2-regular" href="#">
          고객센터
        </Link>
      </div>
    </>
  );
}
