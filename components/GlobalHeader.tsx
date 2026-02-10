'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from './commons/Button';
import GalleryActiveIcon from '@/public/icon/gallery-active.svg';
import GalleryInActiveIcon from '@/public/icon/gallery-inactive.svg';
import LookBookActiveIcon from '@/public/icon/lookbook-active.svg';
import LookBookInActiveIcon from '@/public/icon/lookbook-inactive.svg';
import SubmitStarIcon from '@/public/icon/submit-star.svg';
import PlusIcon from '@/public/icon/plus.svg';
import CreditIcon from '@/public/icon/credit.svg';
import { useState, useEffect, useRef } from 'react';
import AuthModal from './auth/AuthModal';
import { getCreditBalance } from '@/lib/api';
import Modal from './Modal';
import SellerTermsAndConditions from './terms/TC-seller';
import { upgradeToSeller } from '@/lib/api';

type ModalView = 'login' | 'signup';

export default function GlobalHeader() {
  const { isLoggedIn, user, logout, isLoading, accessToken, reissueToken } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const currentView = searchParams.get('view') || 'lookbook';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState<ModalView>('login');
  const justSignedUp = useRef(false);
  const [isMounted, setIsMounted] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [showUpgradeSellerModal, setShowUpgradeSellerModal] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // 서버와 클라이언트의 렌더링 불일치 문제 (Hydration Mismatch) 해결 위한 isMounted 상태를 이용한 렌더링 시점 제어
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    const fetchDatas = async () => {
      const balance = await getCreditBalance(accessToken);
      setBalance(balance.currentCredit);
      console.log('balance', balance.currentCredit);
    };
    fetchDatas();
  }, [accessToken]);

  useEffect(() => {
    // 직전 렌더링에서 회원가입이 막 완료되었다면, GUEST->USER 역할 변경이
    // 반영되기 전이라도 모달을 띄우는 로직을 한 번 건너뜁니다.
    if (justSignedUp.current) {
      justSignedUp.current = false;
      return;
    }

    const isSignup = searchParams.get('signup');
    // GUEST 역할 사용자가 회원가입을 완료하지 않고 새로고침하거나 다른 페이지로 이동한 경우,
    // 홈페이지로 돌아왔을 때 다시 회원가입 모달을 띄워주기 위함.
    if ((isSignup === 'true' || user?.role === 'GUEST') && isLoggedIn) {
      setModalView('signup');
      setIsModalOpen(true);
    }
  }, [searchParams, user, isLoggedIn]);

  const openModal = (view: ModalView = 'login') => {
    setModalView(view);
    setIsModalOpen(true);
  };

  const closeModal = (signupSuccess: boolean = false) => {
    if (signupSuccess) {
      // 다음 useEffect 실행을 건너뛰도록 플래그를 설정합니다.
      justSignedUp.current = true;
    }

    setIsModalOpen(false);

    // 사용자가 (성공적으로 가입하지 않고) 회원가입 모달을 닫고, 아직 GUEST 역할이라면 로그아웃 처리
    if (!signupSuccess && modalView === 'signup' && user?.role === 'GUEST') {
      logout();
    }

    // 모달이 닫힐 때 URL에서 'signup' 파라미터를 제거합니다.
    const params = new URLSearchParams(searchParams.toString());
    if (params.has('signup')) {
      params.delete('signup');
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  };

  const handleViewChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', value);
    router.push(`/?${params.toString()}`);
  };

  const handlePromptButtonInteraction = async () => {
    if (accessToken && isLoggedIn && user) {
      // 사용자 데이터(특히 역할)의 신선함을 보장하기 위해 토큰을 재발급
      const reissuedAuth = await reissueToken();
      // 재발행된 토큰의 데이터에서 업데이트된 역할 사용
      const currentRole = reissuedAuth.role;
      if (currentRole === 'SELLER') {
        router.push('/sales');
      } else {
        setShowUpgradeSellerModal(true);
      }
    } else {
      alert('로그인이 필요합니다.');
      openModal('login');
    }
  };

  const handleUpgradeSeller = async () => {
    if (!accessToken || !user) {
      alert('로그인이 필요합니다.');
      setShowUpgradeSellerModal(false);
      router.push('/login');
      return;
    }
    try {
      await upgradeToSeller(accessToken, true);
      await reissueToken(); // 서버에서 사용자 데이터 새로 고침
      alert('판매자로 등록되었습니다!');
      setShowUpgradeSellerModal(false);
      router.push('/sales');
    } catch (error) {
      console.error('Failed to upgrade to seller:', error);
      alert('판매자 등록에 실패했습니다. 다시 시도해주세요.');
      setShowUpgradeSellerModal(false);
    }
  };

  return (
    <>
      <header className="fixed top-3 z-15 flex w-[calc(100%-32px)] items-center justify-between rounded-3xl bg-white px-7 py-3 shadow-[0px_0px_10px_0px_rgba(20,20,20,0.10)]">
        <div className="inline-flex items-center gap-8">
          <Link href="/">
            <Image src="/icon/logo.svg" alt="Logo" width={133} height={31} />
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
              prefixIcon={
                currentView !== 'gallery' ? <GalleryInActiveIcon /> : <GalleryActiveIcon />
              }
              onClick={() => handleViewChange('gallery')}
            >
              갤러리
            </Button>
          </div>
        </div>
        <div className="inline-flex items-center gap-7">
          {!isMounted || isLoading ? (
            <p className="typo-body1-medium">로딩중...</p>
          ) : !isLoggedIn ? (
            <Button size="md" onClick={() => openModal('login')}>
              로그인
            </Button>
          ) : (
            <>
              {pathName !== '/sales' && (
                <Button
                  onClick={handlePromptButtonInteraction}
                  variant="gradientSolid"
                  size="md"
                  suffixIcon={<SubmitStarIcon />}
                >
                  프롬프트 등록
                </Button>
              )}
              <div className="inline-flex items-center gap-1 rounded-full">
                <span className="inline-flex items-center gap-1 rounded-full px-5 py-2.5 outline outline-2 outline-offset-[-2px] outline-gray-500">
                  <p className="typo-body1-bold">{balance}</p>
                  <CreditIcon className="h-5 w-5" />
                </span>
                <Link href="/credit">
                  <Button size="md" prefixIcon={<PlusIcon />} className="p-3" />
                </Link>
              </div>
              <div className="inline-flex items-center gap-1 rounded-full">
                <Link
                  href="/profile"
                  className="h-10 w-10 overflow-hidden rounded-full bg-gray-500"
                >
                  {user?.profileImageUrl ? (
                    <img className="h-full w-full" src={user.profileImageUrl} alt="Profile image" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-500" />
                  )}
                </Link>
                <p className="typo-body1-medium">{user?.nickname}</p>
              </div>
              <Button variant="outline" size="md" className="text-gray-600" onClick={logout}>
                로그아웃
              </Button>
            </>
          )}
        </div>
      </header>
      <AuthModal isOpen={isModalOpen} onClose={closeModal} initialView={modalView} />

      <Modal
        size="lg"
        isOpen={showUpgradeSellerModal}
        onClose={() => setShowUpgradeSellerModal(false)}
      >
        <div className="mb-3 space-y-3">
          <h2 className="typo-heading2-semibold text-gray-800">판매자 신청</h2>
          <p className="typo-body2-regular text-gray-800">
            프롬포트를 등록하고 수익을 창출하려면{' '}
            <b className="typo-body2-semibold">판매자 신청 동의</b>가 필요합니다.
          </p>
          <div className="h-36.75 overflow-y-scroll rounded-lg bg-gray-300 text-gray-800">
            <SellerTermsAndConditions />
          </div>
        </div>
        <div className="text-right">
          <Button size="sm" onClick={handleUpgradeSeller}>
            신청하기
          </Button>
        </div>
      </Modal>
    </>
  );
}
