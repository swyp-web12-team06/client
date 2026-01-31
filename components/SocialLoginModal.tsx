"use client";

import XMarkIcon from "@/public/icon/input-clear.svg";
import { Button } from "./commons/Button";

interface SocialLoginModalProps {
  onClose: () => void;
}

export default function SocialLoginModal({ onClose }: SocialLoginModalProps) {
  
  const handleSocialLogin = (provider: "google" | "naver" | "kakao") => {
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-lg bg-white p-8 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          className="absolute bg-transparent hover:bg-transparent top-4 right-4"
          onClick={onClose}
          suffixIcon={<XMarkIcon />}
        />
        <div className="text-center">
          <h2 className="text-2xl font-bold">소셜 로그인</h2>
        </div>
        <div className="flex flex-col justify-center mt-8 space-y-4">
          <Button className="bg-red-300 hover:bg-red-400 text-gray-800"
            onClick={() => handleSocialLogin("google")}>
            Google 계정으로 로그인
          </Button>
          <Button className="bg-green-300 hover:bg-green-400 text-gray-800"
            onClick={() => handleSocialLogin("naver")}>
            네이버 계정으로 로그인
          </Button>
          <Button className="bg-yellow-300 hover:bg-yellow-400 text-gray-800"
            onClick={() => handleSocialLogin("kakao")}>
            카카오 계정으로 로그인
          </Button>
        </div>
      </div>
    </div>
  );
}
