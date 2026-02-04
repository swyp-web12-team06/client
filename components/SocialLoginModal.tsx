'use client';

import { Button } from './commons/Button';
import Modal from './Modal';

interface props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SocialLoginModal({ isOpen, onClose }: props) {
  const handleSocialLogin = (provider: 'google' | 'naver' | 'kakao') => {
    window.location.href = `api/oauth2/authorization/${provider}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
    </Modal>
  );
}
