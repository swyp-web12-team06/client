'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from './commons/Button';
import GalleryActiveIcon from '@/public/icon/gallery-active.svg';
import GalleryInActiveIcon from '@/public/icon/gallery-inactive.svg';
import LookBookActiveIcon from '@/public/icon/lookbook-active.svg';
import LookBookInActiveIcon from '@/public/icon/lookbook-inactive.svg';
import SubmitStarIcon from '@/public/icon/submit-star.svg';
import PlusIcon from '@/public/icon/plus.svg';
import CreditIcon from '@/public/icon/credit.svg';
import { useState } from 'react';
import SocialLoginModal from './SocialLoginModal';

export default function GlobalHeader() {
  const { isLoggedIn, user, logout, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || 'lookbook';
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleViewChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', value);
    router.push(`/?${params.toString()}`);
  };

  return (
    <>
      <header className="fixed w-[calc(100%-32px)] top-3 z-15 flex items-center justify-between rounded-3xl bg-white px-7 py-3 shadow-[0px_0px_10px_0px_rgba(20,20,20,0.10)]">
        <div className="inline-flex items-center gap-8">
          <Link href="/">
            <Image src="/icon/logo.svg" alt="Logo" width={133} height={22} />
          </Link>
          <div className="inline-flex items-center justify-center rounded-full outline outline-1 outline-offset-[-1px] outline-gray-500 hover:bg-gray-300">
            <Button
              className={`w-40 bg-transparent text-gray-500 transition-none ${currentView == 'lookbook' ? 'bg-gray-900 text-gray-50 hover:bg-gray-900' : 'hover:bg-transparent hover:text-gray-600'}`}
              prefixIcon={
                currentView !== 'lookbook' ? <LookBookInActiveIcon /> : <LookBookActiveIcon />
              }
              onClick={() => handleViewChange('lookbook')}
            >
              룩북
            </Button>
            <Button
              className={`w-40 bg-transparent text-gray-500 transition-none ${currentView == 'gallery' ? 'bg-gray-900 text-gray-50 hover:bg-gray-900' : 'hover:bg-transparent hover:text-gray-600'}`}
              prefixIcon={currentView !== 'gallery' ? <GalleryInActiveIcon /> : <GalleryActiveIcon />}
              onClick={() => handleViewChange('gallery')}
            >
              갤러리
            </Button>
          </div>
        </div>
        <div className="inline-flex items-center gap-7">
          {isLoading ? (
            <p className="typo-body1-medium">로딩중...</p>
          ) : !isLoggedIn ? (
            <Button size="md" onClick={openModal}>
              로그인
            </Button>
          ) : (
            <>
              <Button variant="gradientSolid" size="md" suffixIcon={<SubmitStarIcon />}>
                프롬프트 등록
              </Button>
              <div className="inline-flex items-center gap-1 rounded-full">
                <span className="inline-flex items-center gap-1 rounded-full px-5 py-2.5 outline outline-2 outline-offset-[-2px] outline-gray-500">
                  <p className="typo-body1-bold">4800</p>
                  <CreditIcon className="h-5 w-5" />
                </span>
                <Button size="md" prefixIcon={<PlusIcon />} className="p-3" />
              </div>
              <div className="inline-flex items-center gap-1 rounded-full">
                <span className="h-10 w-10 rounded-full bg-gray-500"></span>
                <p className="typo-body1-medium">{user?.nickname}</p>
              </div>
              <Button variant="outline" size="md" className="text-gray-600" onClick={logout}>
                로그아웃
              </Button>
            </>
          )}
        </div>
      </header>
      {isModalOpen && <SocialLoginModal onClose={closeModal} />}
    </>
  );
}
