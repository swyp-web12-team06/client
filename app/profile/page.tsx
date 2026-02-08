'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { Product } from '@/type/product';
import { PurchasedItem } from '@/type/image';
import Lookbook from '../_components/Lookbook';
import ProfileEditModal from '@/app/profile/ProfileEditModal';
import { cn } from '@/utils/styles';
import { httpClient } from '@/lib/api';

export default function ProfilePage() {
  const { user, isLoggedIn, isLoading, accessToken, reissueToken } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'sales' | 'purchases' | 'archive'>('sales');
  const [products, setProducts] = useState<Product[]>([]);
  const [purchasedItems, setPurchasedItems] = useState<PurchasedItem[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null); // 무한 스크롤 트리거 참조
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProductsLibrary = async (
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

  const fetchGeneratedImages = async (page: number, size: number, accessToken: string) => {
    const imagesResult = await httpClient.get<{ data: { content: PurchasedItem[] } }>(
      `/user/me/library/purchases?page=${page}&size=${size}`,
      accessToken,
    );
    return imagesResult.data.content || [];
  };

  useEffect(() => {
    setCurrentPage(0);
    setProducts([]);
    setHasMore(true);
  }, [activeTab]);

  // 무한스크롤
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/');
    }

    const getLibrary = async () => {
      if (!isLoggedIn || !accessToken || loadingMore) return;
      if (!hasMore && currentPage > 1) return;

      setLoadingMore(true);
      try {
        let newData: Product[] | PurchasedItem[];

        if (activeTab === 'archive') {
          newData = await fetchGeneratedImages(currentPage, pageSize, accessToken);
          if (currentPage === 0) {
            setPurchasedItems(newData as PurchasedItem[]);
          } else {
            setPurchasedItems((prevImages) => [
              ...(prevImages || []),
              ...(newData as PurchasedItem[]),
            ]);
          }
          setHasMore(newData.length === pageSize);
        } else {
          newData = await fetchProductsLibrary(activeTab, currentPage, pageSize, accessToken);
          if (currentPage === 1) {
            setProducts(newData as Product[]);
          } else {
            setProducts((prevProducts) => [...(prevProducts || []), ...(newData as Product[])]);
          }
          setHasMore(newData.length === pageSize);
        }
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
  }, [isLoading, isLoggedIn, router, activeTab, accessToken, currentPage, pageSize]);

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

  const libraryTabStyleHandle = (type: 'sales' | 'purchases' | 'archive') => {
    return cn(
      'typo-body1-medium cursor-pointer',
      activeTab === type ? 'text-primary-200 border-primary-200 border-b-2' : 'text-gray-500',
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
          <button className={libraryTabStyleHandle('sales')} onClick={() => setActiveTab('sales')}>
            판매 목록
          </button>
          <button
            className={libraryTabStyleHandle('purchases')}
            onClick={() => setActiveTab('purchases')}
          >
            구매 목록
          </button>
          <button
            className={libraryTabStyleHandle('archive')}
            onClick={() => setActiveTab('archive')}
          >
            보관함
          </button>
        </div>
        {activeTab === 'archive' ? (
          <div>
            {loadingMore && purchasedItems.length === 0 ? (
              <div className="flex h-40 items-center justify-center">
                Loading generated images...
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {purchasedItems.map((item) => (
                  <div key={item.purchase_id}>
                    {item.generated_images?.map((image) => (
                      <div>
                        <Image
                          onClick={() => setIsModalOpen(true)}
                          alt={image.image_url}
                          key={image.image_id}
                          src={image.image_url}
                          width={200}
                          height={180}
                          className="cursor-pointer rounded-2xl"
                        />
                        {item.variables.map((variable) => (
                          <span className="mr-2">{variable.value}</span>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <Lookbook data={products} />
        )}
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
