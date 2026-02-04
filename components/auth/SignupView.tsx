'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/commons/Button';
import Input from '@/components/commons/Input';
import CheckIcon from '@/public/icon/check.svg';
import ArrowIcon from '@/public/icon/arrow.svg';
import { cn } from '@/utils/styles';
import Link from 'next/link';

interface SignupViewProps {
  onSuccess: () => void;
}

type Agreement = {
  id: 'service' | 'privacy' | 'marketing';
  text: string;
  required: boolean;
};

export default function SignupView({ onSuccess }: SignupViewProps) {
  const { user, accessToken, setUserInfo } = useAuth();

  const [nickname, setNickname] = useState('');
  const [agreements, setAgreements] = useState({
    service: false,
    privacy: false,
    marketing: false,
  });

  const agreementList: Agreement[] = [
    { id: 'service', text: '[필수] 서비스 이용약관', required: true },
    { id: 'privacy', text: '[필수] 개인정보 처리방침', required: true },
    { id: 'marketing', text: '[선택] 마케팅 정보 수신 동의', required: false },
  ];

  useEffect(() => {
    if (user) {
      setNickname(user.nickname || '');
    }
  }, [user]);

  const handleAgreementChange = (id: keyof typeof agreements) => {
    setAgreements((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAgreeToAll = () => {
    const allAgreed = Object.values(agreements).every(Boolean);
    setAgreements({
      service: !allAgreed,
      privacy: !allAgreed,
      marketing: !allAgreed,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreements.service || !agreements.privacy) {
      alert('필수 약관에 모두 동의해야 합니다.');
      return;
    }

    if (!user || !accessToken) {
      alert('사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          userId: user.id,
          nickname,
          termsAgreed: agreements.service && agreements.privacy,
          marketingConsent: agreements.marketing,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message);
        throw new Error(errorData.message || '회원가입에 실패했습니다.');
      }

      setUserInfo({ ...user, nickname, role: 'USER' });
      alert('회원가입이 완료되었습니다!');
      onSuccess();
    } catch (err: any) {
      const errorMessage = err.message || '알 수 없는 오류가 발생했습니다.';
      alert(errorMessage);
      console.error('Signup error:', err);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="my-11">
          <Button
            type="button"
            className="border-primary-200 w-full"
            size="sm"
            variant="outline"
            onClick={handleAgreeToAll}
          >
            약관에 모두 동의
          </Button>
          <div className="bg-gray-450 my-6 h-px w-full" />
          <div>
            {agreementList.map(({ id, text }) => (
              <div key={id} className="flex h-10 items-center justify-between">
                <label
                  htmlFor={id}
                  className={cn(
                    'flex cursor-pointer items-center',
                    agreements[id] ? 'text-gray-900' : 'text-gray-600',
                  )}
                >
                  <div className="relative flex h-6 w-6 items-center justify-center">
                    <input
                      id={id}
                      type="checkbox"
                      checked={agreements[id]}
                      onChange={() => handleAgreementChange(id)}
                      className="absolute z-10 h-full w-full cursor-pointer appearance-none"
                    />
                    <CheckIcon />
                  </div>
                  <span className="typo-body1-regular ml-2 transition-colors">{text}</span>
                </label>
                <Link
                  href="#"
                  className="text-gray-450 flex aspect-square w-6 items-center justify-center"
                >
                  <ArrowIcon />
                </Link>
              </div>
            ))}
          </div>

          <Input
            id="nickname"
            className="mt-6"
            type="text"
            label="닉네임"
            variant="secondary"
            size="small"
            value={nickname}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNickname(e.target.value)}
            placeholder="예: AI Artist"
            required
          />
        </div>

        <Button type="submit" size="sm" className="w-full">
          가입하기
        </Button>
      </form>
    </>
  );
}
