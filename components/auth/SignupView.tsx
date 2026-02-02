'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/commons/Button';
import Input from '@/components/commons/Input';

interface SignupViewProps {
  onSuccess: () => void;
}

export default function SignupView({ onSuccess }: SignupViewProps) {
  const { user, accessToken, setUserInfo } = useAuth();

  const [nickname, setNickname] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setNickname(user.nickname || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!termsAgreed) {
      setError('필수 약관 동의가 필요합니다.');
      return;
    }

    if (!user || !accessToken) {
      setError('사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
      return;
    }

    try {
      const response = await fetch('/api/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          userId: user.id,
          nickname,
          termsAgreed,
          marketingConsent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '회원가입 완료에 실패했습니다.');
      }

      setUserInfo({
        ...user,
        nickname,
        role: 'USER',
      });

      alert('회원가입이 완료되었습니다!');
      onSuccess();
    } catch (err: any) {
      setError(err.message || '알 수 없는 오류가 발생했습니다.');
      console.error('Signup error:', err);
    }
  };

  return (
    <>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">회원가입 정보 입력</h1>
        <p className="mt-2 text-sm text-gray-600">
          소셜 로그인으로 가입이 진행되었으며, 추가 정보를 입력해주세요.
        </p>
      </div>

      {error && <div className="mt-4 rounded-md bg-red-100 p-3 text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="nickname" className="mb-1 block text-sm font-medium text-gray-700">
            닉네임
          </label>
          <Input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNickname(e.target.value)}
            placeholder="닉네임을 입력해주세요"
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center">
            <input
              id="termsAgreed"
              type="checkbox"
              checked={termsAgreed}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTermsAgreed(e.target.checked)
              }
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              required
            />
            <label htmlFor="termsAgreed" className="ml-2 text-sm font-medium text-gray-900">
              필수 약관 동의 <span className="text-red-500">*</span>
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="marketingConsent"
              type="checkbox"
              checked={marketingConsent}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setMarketingConsent(e.target.checked)
              }
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="marketingConsent" className="ml-2 text-sm font-medium text-gray-900">
              마케팅 정보 수신 동의 (선택)
            </label>
          </div>
        </div>

        <Button type="submit" className="w-full">
          회원가입 완료
        </Button>
      </form>
    </>
  );
}
