'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { Product } from '@/type/product';
import Lookbook from '../_components/Lookbook';
import ProfileEditModal from '@/app/profile/ProfileEditModal';
import { cn } from '@/utils/styles';
import { httpClient } from '@/lib/api';

export default function ProfilePage() {
  const { user, isLoggedIn, isLoading, accessToken, reissueToken } = useAuth();
  const router = useRouter();
  const [requestType, setRequestType] = useState('sales');
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null); // 무한 스크롤 트리거 참조
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const fetchLibrary = async (
    requestType: string,
    page: number,
    size: number,
    accessToken: string,
  ) => {
    const libraryResult = await httpClient.get<{ data: Array<{ prompt_id: number }> }>(
      `/user/me/library/${requestType}?page=${page}&size=${size}`,
      accessToken,
    );
    const libraryItems: { prompt_id: number }[] = libraryResult.data || [];

    if (libraryItems.length === 0) {
      return [];
    }

    const promptIds = libraryItems.map((item) => item.prompt_id);

    const productPromises = promptIds.map(async (promptId) => {
      try {
        const productData = await httpClient.get<{ data: Product }>(
          `/product/${promptId}`,
          accessToken,
        );
        return productData.data;
      } catch (error) {
        console.error(`Failed to fetch product with promptId ${promptId}:`, error);
        return null;
      }
    });

    const products = await Promise.all(productPromises);
    const transformedData = products.filter((product): product is Product => product !== null);
    return transformedData;
  };

  useEffect(() => {
    setCurrentPage(1);
    setProducts([]);
    setHasMore(true);
  }, [requestType]);

  // 무한스크롤
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/');
    }

    const getLibrary = async () => {
      // 로그인하지 않았거나 토큰이 없거나 이미 로드된 경우 가져오기 방지
      if (!isLoggedIn || !accessToken || loadingMore) return;
      // 첫 페이지가 아닌 항목이 더 이상 없는 경우 가져오기 방지
      if (!hasMore && currentPage > 1) return;

      setLoadingMore(true);
      try {
        const newProducts = await fetchLibrary(requestType, currentPage, pageSize, accessToken);

        if (currentPage === 1) {
          setProducts(newProducts);
        } else {
          setProducts((prevProducts) => [...(prevProducts || []), ...newProducts]);
        }
        setHasMore(newProducts.length === pageSize); // 페이지가 더 있는지 확인
      } catch (error) {
        console.error('Failed to fetch library:', error);
        setHasMore(false);
      } finally {
        setLoadingMore(false);
      }
    };

    if (isLoggedIn && accessToken) {
      getLibrary();
    }
  }, [isLoading, isLoggedIn, router, requestType, accessToken, currentPage, pageSize]);

  // 옵저버
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 트리거 요소가 보이고 더 많은 항목이 있으며 현재 로드되지 않는 경우
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, loadingMore]);

  if (isLoading || !products) {
    return <div className="flex min-h-screen items-center justify-center">Loading profile...</div>;
  }

  if (!isLoggedIn || !user) {
    return null;
  }

  const libraryTabStyleHandle = (type: string) => {
    return cn(
      'typo-body1-medium cursor-pointer',
      requestType === type ? 'text-primary-200 border-primary-200 border-b-2' : 'text-gray-500',
    );
  };

  return (
    <main className="no-padding flex w-full flex-col">
      <div className="relative h-85 w-full bg-gray-400">
        <button className="absolute -bottom-18.5 left-1/2 mx-auto flex h-37 w-37 -translate-x-1/2 items-center justify-center rounded-full border-[6px] border-gray-50 bg-gray-400 text-gray-500">
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt="Profile image"
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            'No image'
          )}
        </button>
      </div>
      <div className="mt-18.5 pt-1.5">
        <h3 className="typo-heading1-semibold flex items-center justify-center text-gray-800">
          {user.nickname}
          <button className="ml-1.5 cursor-pointer" onClick={() => setIsProfileModalOpen(true)}>
            <Image src="/icon/name-edit.svg" alt="Nickname edit icon" width={28} height={28} />
          </button>
        </h3>
        <span className="typo-body1-regular mx-auto block max-w-100.5 text-center text-gray-600">
          {user.bio}
        </span>
      </div>
      <div className="mx-auto w-full px-4 pb-28 md:max-w-308">
        <div className="mb-5 flex w-full gap-11 border-b border-gray-500">
          <button
            className={libraryTabStyleHandle('sales')}
            onClick={() => setRequestType('sales')}
          >
            판매 목록
          </button>
          <button
            className={libraryTabStyleHandle('purchases')}
            onClick={() => setRequestType('purchases')}
          >
            구매 목록
          </button>
        </div>
        <Lookbook data={products} />
        <div ref={loadMoreRef} className="h-10 w-full" /> {/* 무한스크롤 트리거 */}
      </div>

      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentNickname={user.nickname}
        currentBio={user.bio}
        currentProfileImageUrl={user.profileImageUrl}
        onProfileUpdate={reissueToken}
      />
    </main>
  );
}
