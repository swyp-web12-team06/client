'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { Product, SalesItem } from '@/type/product';
import { PurchasedItem } from '@/type/image';
import Lookbook from '../_components/Lookbook';
import ProfileEditModal from '@/app/profile/ProfileEditModal';
import { cn } from '@/utils/styles';
import { httpClient } from '@/lib/api';
import Link from 'next/link';
import Skeleton from '@/components/commons/Skeleton';
import Placeholder from '@/components/commons/Placeholder';

function LookbookSkeletonItem() {
  return (
    <div className="flex h-54 cursor-pointer divide-x divide-gray-300 overflow-hidden rounded-2xl border border-gray-300">
      <div className="relative w-full">
        <Skeleton />
      </div>
    </div>
  );
}

function ProfilePageSkeleton() {
  return (
    <main className="no-padding flex w-full animate-pulse flex-col">
      <div className="relative h-85 w-full bg-gray-300"></div>
      <div className="absolute -bottom-18.5 left-1/2 mx-auto flex h-37 w-37 -translate-x-1/2 items-center justify-center rounded-full border-[6px] border-gray-50 bg-gray-300"></div>
      <div className="mt-18.5 flex flex-col items-center gap-y-2 pt-1.5">
        <div className="h-8 w-32 rounded-md bg-gray-300" />
        <div className="h-6 w-64 rounded-md bg-gray-300" />
      </div>
      <div className="mx-auto w-full px-4 pb-28 md:max-w-308">
        <div className="my-5 h-10 w-full gap-11 border-b border-gray-300" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-54 w-full rounded-2xl bg-gray-300" />
          ))}
        </div>
      </div>
    </main>
  );
}

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

  const getUniqueProducts = useCallback((products: Product[]): Product[] => {
    const uniqueIds = new Set<number>();
    return products.filter((product) => {
      if (uniqueIds.has(product.promptId)) {
        return false;
      }
      uniqueIds.add(product.promptId);
      return true;
    });
  }, []);

  const handleDownload = async (event: React.MouseEvent, imageUrl: string, imageId: number) => {
    event.preventDefault();

    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `generated_image_${imageId}.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error during image download:', error);
      alert('이미지 다운로드에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const fetchProductsLibrary = async (
    requestType: string,
    page: number,
    size: number,
    accessToken: string,
  ) => {
    const libraryResult = await httpClient.get<{
      data: { content: (PurchasedItem | SalesItem)[] };
    }>(`/user/me/library/${requestType}?page=${page}&size=${size}`, accessToken);
    const libraryItems = libraryResult.data.content;

    if (libraryItems.length === 0) {
      return [];
    }

    const productPromises = libraryItems.map(async (item) => {
      try {
        const productData = await httpClient.get<{ data: Product }>(
          `/product/${item.prompt_id}`,
          accessToken,
        );
        const productWithStatus: Product = { ...productData.data };
        if (requestType === 'sales' && 'status' in item) {
          productWithStatus.userStatus = (item as SalesItem).status;
        }
        return productWithStatus;
      } catch (error) {
        console.error(`Failed to fetch product with promptId ${item.prompt_id}:`, error);
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
    setPurchasedItems([]);
    setHasMore(true);
  }, [activeTab]);

  // 무한스크롤
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/');
    }

    const getLibrary = async () => {
      if (!isLoggedIn || !accessToken) return;
      if (!hasMore && currentPage > 0) return;

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
          if (activeTab === 'purchases') {
            if (currentPage === 0) {
              setProducts(getUniqueProducts(newData as Product[]));
            } else {
              setProducts((prev) => getUniqueProducts([...(prev || []), ...(newData as Product[])]));
            }
          } else {
            if (currentPage === 0) {
              setProducts(newData as Product[]);
            } else {
              setProducts((prev) => [...(prev || []), ...(newData as Product[])]);
            }
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
  }, [isLoading, isLoggedIn, router, activeTab, accessToken, currentPage, pageSize, getUniqueProducts]);

  // 옵저버
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
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

  if (isLoading) {
    return <ProfilePageSkeleton />;
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

  const userId = sessionStorage.getItem('userId');

  const renderTabContent = () => {
    if (activeTab === 'archive') {
      if (loadingMore && purchasedItems.length === 0) {
        return (
          <div className="columns-2 md:columns-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-54">
                <Skeleton />
              </div>
            ))}
          </div>
        );
      }
      if (purchasedItems.length === 0 && !loadingMore) {
        return (
          <div className="flex h-40 flex-col items-center justify-center gap-4">
            <Placeholder variant="image" className="h-20! w-20! bg-transparent" />
            <p className="typo-body1-medium text-gray-500">보관된 이미지가 없습니다.</p>
          </div>
        );
      }
      return (
        <div className="columns-2 md:columns-3 gap-4">
          {purchasedItems.map((item) => (
            <div
              key={item.purchase_id}
            >
              {item.generated_images?.map((image) =>
                image.image_url ? (
                  <Link
                    key={image.image_id}
                    href={image.image_url}
                    onClick={(e) => handleDownload(e, image.image_url, image.image_id)}
                    className="block"
                  >
                    <Image
                      alt={`Generated Image ${image.image_id}`}
                      src={image.image_url}
                      width={200}
                      height={180}
                      className="h-full w-full rounded-2xl object-cover"
                    />
                  </Link>
                ) : (
                  <Placeholder
                    key={image.image_id}
                    variant="image"
                    className="h-54 w-full bg-gray-300"
                  />
                ),
              )}
            </div>
          ))}
        </div>
      );
    } else {
      if (loadingMore && products.length === 0) {
        return (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <LookbookSkeletonItem key={i} />
            ))}
          </div>
        );
      }
      if (products.length === 0 && !loadingMore) {
        return (
          <div className="flex h-40 flex-col items-center justify-center gap-4">
            <Placeholder variant="image" className="h-20! w-20! bg-transparent" />
            <p className="typo-body1-medium text-gray-500">목록이 비어있습니다.</p>
          </div>
        );
      }
      return <Lookbook data={products} userId={userId ?? undefined} />;
    }
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
            <Placeholder variant="avatar" className="h-full w-full" />
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
        {renderTabContent()}
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
