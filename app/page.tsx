import { getCategories, getProducts } from '@/lib/api';
import HomePageClient from './HomePageClient';
import { Suspense } from 'react';

interface props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function HomePage({ searchParams: searchParamsPromise }: props) {

  const searchParams = await searchParamsPromise;
  
  // 검색 매개변수를 일반 객체로 변환
  const resolvedSearchParams = {
    keyword: searchParams.keyword,
    categoryId: searchParams.categoryId,
    sort: searchParams.sort,
    page: searchParams.page,
    size: searchParams.size,
  };

  // 카테고리 및 상품 데이터 병렬 가져오기
  const [categories, productsData] = await Promise.all([
    getCategories(),
    getProducts(resolvedSearchParams), // 검색 매개변수를 API에 전달
  ]);

  return (
    <Suspense fallback={<div className="text-center pt-20">Loading...</div>}>
      <HomePageClient
        initialProducts={productsData?.content || []}
        totalPages={productsData?.totalPages || 0}
        categories={categories || []}
      />
    </Suspense>
  );
}
