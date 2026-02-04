'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import LoginView from './LoginView';
import SignupView from './SignupView';
import Image from 'next/image';

type ModalView = 'login' | 'signup';

interface AuthModalProps {
  isOpen: boolean;
  onClose: (signupSuccess?: boolean) => void;
  initialView?: ModalView;
}

export default function AuthModal({ isOpen, onClose, initialView = 'login' }: AuthModalProps) {
  const [view, setView] = useState<ModalView>(initialView);

  useEffect(() => {
    setView(initialView);
  }, [initialView, isOpen]); // isOpen 추가: 모달이 다시 열릴 때 initialView를 다시 존중하도록

  const handleSocialLogin = (provider: 'google' | 'naver' | 'kakao') => {
    window.location.href = `/api/oauth2/authorization/${provider}`;
  };

  const handleSignupSuccess = () => {
    onClose(true); // 성공 플래그와 함께 닫기
  };

  const handleClose = () => {
    onClose(false); // 사용자가 직접 닫음 (성공 아님)
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div>
        <h3 className="typo-heading2-semibold text-gray-800 mb-3">
          {view === 'login' ? '로그인' : '약관 동의'}
        </h3>
        <Image src="/icon/logo.svg" alt="Logo" width={81} height={20.25} />
        <p className="typo-body1-regular text-gray-800 mt-2.5">
          {view === 'login'
            ? 'AI 이미지를 찾아 떠나는 여정을 시작해 보세요!'
            : '서비스 이용을 위해 약관에 동의해 주세요.'}
        </p>
      </div>
      {view === 'login' ? (
        <LoginView handleSocialLogin={handleSocialLogin} />
      ) : (
        <SignupView onSuccess={handleSignupSuccess} />
      )}
    </Modal>
  );
}
