'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Gallery from '@/components/Gallery';
import { Product } from '@/type/product';

export default function ProfilePage() {
  const { user, isLoggedIn, isLoading, accessToken } = useAuth();
  const router = useRouter();
  const [requestType, setRequestType] = useState('sales');
  const [products, setProducts] = useState<Product[]>([]); // Initialize as empty array
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // API 명세에 맞춰 10으로 변경
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null); // Ref for the infinite scroll trigger

  const fetchLibrary = async (requestType: string, page: number, size: number) => {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/user/me/library/${requestType}?page=${page}&size=${size}`,
      {
        method: 'GET',
        headers: headers,
      },
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    const result = await response.json();

    let transformedData: Product[];

    if (requestType === 'sales') {
      // /user/me/library/sales 응답 변환
      transformedData = result.data.map((item: any) => ({
        ...item,
        promptId: item.prompt_id,
        previewImageUrl: item.preview_image_url,
        createdAt: item.created_at,
      }));
    } else if (requestType === 'purchases') {
      // /user/me/library/purchases 응답 변환
      transformedData = result.data.map((item: any) => ({
        // Product 타입에 맞춰 매핑, 없는 필드는 null/undefined 처리
        promptId: item.prompt_id, // prompt_id는 Product 타입에 있음
        title: item.title, // title은 Product 타입에 있음
        price: item.amount, // amount를 price로 매핑
        previewImageUrl:
          item.generated_images && item.generated_images.length > 0
            ? item.generated_images[0].image_url
            : null, // 첫 번째 생성 이미지 URL 사용 또는 null
        createdAt: item.purchased_at, // purchased_at을 createdAt으로 매핑

        // Product 타입에 있지만 purchases 응답에 없는 필드들은 null 또는 기본값으로 설정
        description: null,
        userStatus: null,
        categoryId: null,
        categoryName: null,
        modelId: null,
        modelName: null,
        representativeImageUrls: [],
        tags: [],
        seller: { id: null, nickname: null }, // seller 객체도 Product 타입에 맞춰 구조화
        updatedAt: null,
      }));
    } else {
      // 예상치 못한 requestType에 대한 처리 (기존 로직 유지)
      transformedData = result.data.map((item: any) => ({
        ...item,
        promptId: item.prompt_id,
        previewImageUrl: item.preview_image_url,
        createdAt: item.created_at,
      }));
    }

    return transformedData; // Transformed data is the array of products
  };

  // Effect for fetching library data based on currentPage and other dependencies
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/');
    }

    const getLibrary = async () => {
      // Prevent fetching if not logged in, no token, or already loading
      if (!isLoggedIn || !accessToken || loadingMore) return;
      if (!hasMore && currentPage > 1) return; // Prevent fetching if no more items and not the first page

      setLoadingMore(true);
      try {
        const newProducts = await fetchLibrary(requestType, currentPage, pageSize);

        if (currentPage === 1) {
          setProducts(newProducts);
        } else {
          setProducts((prevProducts) => [...(prevProducts || []), ...newProducts]);
        }
        setHasMore(newProducts.length === pageSize); // Determine if there are more pages
      } catch (error) {
        console.error('Failed to fetch library:', error);
        setHasMore(false); // If an error occurs, assume no more items can be loaded
      } finally {
        setLoadingMore(false);
      }
    };

    if (isLoggedIn && accessToken) {
      getLibrary();
    }
  }, [isLoading, isLoggedIn, router, requestType, accessToken, currentPage, pageSize]);

  // Effect for Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // If the trigger element is visible, and there are more items, and not currently loading
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }, // Trigger when 100% of the target is visible
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, loadingMore]); // Re-run observer setup if hasMore or loadingMore changes

  if (isLoading || !products) {
    return <div className="flex min-h-screen items-center justify-center">Loading profile...</div>;
  }

  if (!isLoggedIn || !user) {
    return null; // Should be redirected by useEffect, but good to have as a fallback
  }

  return (
    <div className="flex w-full flex-col">
      <div className="relative h-[340px] w-full bg-gray-400">
        <button className="absolute -bottom-[74px] left-1/2 mx-auto flex h-[148px] w-[148px] -translate-x-1/2 cursor-pointer items-center justify-center rounded-full border border-[6px] border-gray-50 bg-gray-400">
          {user.profileImageUrl ? (
            <Image
              src={user.profileImageUrl}
              alt="Profile image"
              width={148}
              height={148}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            'No image'
          )}
        </button>
      </div>
      <div className="mt-[74px] pt-[6px]">
        <h3 className="typo-heading1-semibold flex items-center justify-center text-gray-800">
          {user.nickname}
          <button className="ml-[6px] cursor-pointer">
            <Image src="/icon/name-edit.svg" alt="Nickname edit icon" width={28} height={28} />
          </button>
        </h3>
        <span className="typo-body1-regular mx-auto block max-w-[402px] text-center text-gray-600">
          {user.bio}
        </span>
      </div>
      {/* Tab selection for sales/favorites/etc. would go here */}
      <div className="max-w-[1232px]">
        <div>
          <button onClick={() => setRequestType('sales')}>판매 목록</button>
          <button onClick={() => setRequestType('purchases')}>구매 목록</button>
        </div>
        <Gallery data={products} />
      </div>
    </div>
  );
}
