'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { Product, SalesItemFromApi } from '@/type/product';
import { User } from '@/type/user';
import Lookbook from '@/app/_components/Lookbook';
import { httpClient } from '@/lib/api';
import Skeleton from '@/components/commons/Skeleton';
import Placeholder from '@/components/commons/Placeholder';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function LookbookSkeletonItem() {
  return (
    <div className="flex h-54 cursor-pointer divide-x divide-gray-300 overflow-hidden rounded-2xl border border-gray-300">
      <div className="relative w-full">
        <Skeleton />
      </div>
    </div>
  );
}

interface UserProfileClientProps {
  user: User;
  initialProducts: Product[];
  isLastPage: boolean;
}

export default function UserProfileClient({
  user,
  initialProducts,
  isLastPage,
}: UserProfileClientProps) {
  const router = useRouter();
  const { isLoggedIn, isLoading: isAuthLoading } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const transformSalesItemToProduct = useCallback(
    (item: SalesItemFromApi): Product => {
      return {
        promptId: item.prompt_id,
        title: item.title,
        description: '',
        price: item.price,
        userStatus: item.status,
        categoryId: 0,
        categoryName: '',
        modelId: 0,
        modelName: '',
        representativeImageUrls: item.preview_image_url ? [item.preview_image_url] : [],
        previewImageUrl: item.preview_image_url,
        tags: [],
        images: item.preview_image_url
          ? [
              {
                id: item.prompt_id,
                imageUrl: item.preview_image_url,
                isPreview: true,
                isRepresentative: true,
                optionValues: {},
              },
            ]
          : [],
        seller: {
          id: user.userId,
          nickname: user.nickname || '',
          profileImageUrl: user.profileImageUrl || '',
        },
        createdAt: item.created_at,
        updatedAt: item.created_at,
      };
    },
    [user],
  );

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

  const [products, setProducts] = useState<Product[]>(() => getUniqueProducts(initialProducts));
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(!isLastPage);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchMoreProducts = useCallback(async () => {
    const pageSize = 10;
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const res = await httpClient.get<{ data: SalesItemFromApi[] }>(
        `/product/user/${user.userId}?page=${currentPage}&size=${pageSize}`,
      );
      const salesItems = res.data;
      const newProducts = salesItems.map((item) => transformSalesItemToProduct(item));
      if (newProducts.length > 0) {
        setProducts((prev) => getUniqueProducts([...prev, ...newProducts]));
        setCurrentPage((prev) => prev + 1);
      }
      const isLastPage = newProducts.length < pageSize;
      setHasMore(!isLastPage);
    } catch (error) {
      console.error('Failed to fetch more products', error);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [
    currentPage,
    hasMore,
    loadingMore,
    user.userId,
    getUniqueProducts,
    transformSalesItemToProduct,
  ]);

  useEffect(() => {
    if (!isAuthLoading && !isLoggedIn && !isRedirecting) {
      setIsRedirecting(true);
      alert('로그인해야 합니다.');
      router.push('/?login=true');
    }
  }, [isAuthLoading, isLoggedIn, isRedirecting, router]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMoreProducts();
        }
      },
      { threshold: 1.0 },
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [fetchMoreProducts, isLoggedIn]);

  if (isAuthLoading || !isLoggedIn || isRedirecting) {
    return null;
  }

  return (
    <main className="no-padding flex w-full flex-col">
      <div className="relative h-85 w-full bg-gray-400">
        <div className="absolute -bottom-18.5 left-1/2 mx-auto flex h-37 w-37 -translate-x-1/2 items-center justify-center rounded-full border-[6px] border-gray-50 bg-gray-400 text-gray-500">
          {user.profileImageUrl ? (
            <Image
              width={148}
              height={148}
              src={user.profileImageUrl}
              alt="Profile image"
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <Placeholder variant="avatar" className="h-full w-full" />
          )}
        </div>
      </div>
      <div className="mt-18.5 pt-1.5">
        <h3 className="typo-heading1-semibold flex items-center justify-center text-gray-800">
          {user.nickname}
        </h3>
        <span className="typo-body1-regular mx-auto block max-w-100.5 text-center text-gray-600">
          {user.bio}
        </span>
      </div>
      <div className="mx-auto w-full px-4 pb-28 md:max-w-308">
        <div className="mb-5 flex w-full gap-11 border-b border-gray-500">
          <div className="typo-body1-medium border-primary-200 text-primary-200 cursor-pointer border-b-2">
            판매 목록
          </div>
        </div>

        {products.length === 0 && !loadingMore && (
          <div className="flex h-40 flex-col items-center justify-center gap-4">
            <Placeholder variant="image" className="h-20! w-20! bg-transparent" />
            <p className="typo-body1-medium text-gray-500">판매중인 상품이 없습니다.</p>
          </div>
        )}

        {products.length > 0 && <Lookbook data={products} />}

        {loadingMore && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <LookbookSkeletonItem key={i} />
            ))}
          </div>
        )}

        <div ref={loadMoreRef} className="h-10 w-full" />
      </div>
    </main>
  );
}
