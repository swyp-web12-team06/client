'use client';

import { Button } from '@/components/commons/Button';
import Image from 'next/image';
import Link from 'next/link';

interface LoginViewProps {
  handleSocialLogin: (provider: 'google' | 'naver' | 'kakao') => void;
}

export default function LoginView({ handleSocialLogin }: LoginViewProps) {
  const socialLogins: {
    provider: 'google' | 'naver' | 'kakao';
    name: string;
    icon: string;
  }[] = [
    { provider: 'kakao', name: 'Kakao', icon: '/icon/kakao.svg' },
    { provider: 'naver', name: 'Naver', icon: '/icon/naver.svg' },
    { provider: 'google', name: 'Google', icon: '/icon/google.svg' },
  ];

  return (
    <>
      <div className="mt-12 mb-15 flex flex-col justify-center gap-4">
        {socialLogins.map(({ provider, name, icon }) => (
          <Button
            key={provider}
            onClick={() => handleSocialLogin(provider)}
            variant="outline"
            size="sm"
            prefixIcon={<Image src={icon} alt={`${name} icon`} width={24} height={24} />}
          >
            <span className="typo-body1-semibold text-gray-800">{name}로 로그인하기</span>
          </Button>
        ))}
      </div>
      <div className="mx-auto flex max-w-66.25 justify-between gap-11">
        <span className="typo-body2-regular text-gray-600">로그인에 문제가 있으신가요?</span>
        <Link className="text-primary-200 typo-body2-regular" href="#">
          고객센터
        </Link>
      </div>
    </>
  );
}
