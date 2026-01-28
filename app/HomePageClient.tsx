'use client';

import { useState, Suspense, useRef, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Searching from '@/components/Searching';
import Gallery from '@/components/Gallery';
import Lookbook from '@/components/Lookbook';
import { Product } from '@/type/product';
import { Category } from '@/type/category';
import { getProducts } from '@/lib/api';

function View({ data }: { data: Product[] }) {
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'lookbook';
  return view === 'gallery' ? <Gallery data={data} /> : <Lookbook data={data} />;
}

interface props {
  initialProducts: Product[];
  totalPages: number;
  categories: Category[];
}

export default function HomePageClient({ initialProducts, totalPages, categories }: props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 무한스크롤 상태
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(1); // 서버에서 이미 첫 페이지를 불러왔으므로 다음(클라이언트)는 1부터 시작
  const [hasMore, setHasMore] = useState(totalPages > 1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // IntersectionObserver 참조
  const observerRef = useRef<HTMLDivElement | null>(null);

  // 서버로부터 새로운 props가 내려올 때(필터 변경 시), 상태를 동기화하는 useEffect
  useEffect(() => {
    setProducts(initialProducts); // products 목록을 새 데이터로 리셋
    setPage(1); // 다음 페이지 번호를 1로 리셋
    setHasMore(totalPages > 1); // 더 많은 페이지가 있는지 여부 리셋
  }, [initialProducts, totalPages]);


  // 검색 및 필터링 상태
  const selectedCategory = searchParams.get('categoryId');
  const sortOrder = searchParams.get('sort') || 'new';
  const committedSearchTerm = searchParams.get('keyword') || '';
  
  // 실시간 사용자 입력을 위한 상태
  const [inputValue, setInputValue] = useState(committedSearchTerm);

  const [isSearchingVisible, setIsSearchingVisible] = useState(true);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // URL의 searchTerm이 바뀔 때(예: 뒤로가기) input 값 동기화
  useEffect(() => {
    setInputValue(committedSearchTerm);
  }, [committedSearchTerm]);

  // 스크롤에 따른 Searching 컴포넌트 표시/숨김 처리
  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      setIsSearchingVisible(window.scrollY <= 50);
      scrollTimeout.current = setTimeout(() => setIsSearchingVisible(true), 2000);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 무한스크롤 데이터 로드 함수
  const loadMoreProducts = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    
    // 현재 검색 파라미터 유지
    const currentParams: { [key: string]: string } = {};
    searchParams.forEach((value, key) => {
      currentParams[key] = value;
    });

    const newProductsData = await getProducts({ ...currentParams, page: String(page) });

    if (newProductsData && newProductsData.content.length > 0) {
      setProducts(prev => [...prev, ...newProductsData.content]);
      setPage(prev => prev + 1);
      setHasMore(!newProductsData.last);
    } else {
      setHasMore(false);
    }

    setIsLoadingMore(false);
  }, [page, hasMore, isLoadingMore, searchParams]);

  // IntersectionObserver 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreProducts();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loadMoreProducts]);

  // 검색 파라미터 업데이트 함수: 핸들러가 URL 매개변수를 업데이트하여 페이지 재장전 및 상태 재설정을 트리거
  const updateSearchParams = useCallback((params: URLSearchParams) => {
    params.delete('page');
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router]);

  const triggerSearch = useCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set('keyword', term);
    } else {
      params.delete('keyword');
    }
    updateSearchParams(params);
  }, [searchParams, updateSearchParams]);

  // 디바운스 검색을 위한 useEffect
  useEffect(() => {
    // 사용자가 입력을 멈추면 500ms 후에 검색 실행
    if (inputValue !== committedSearchTerm) {
      const timeoutId = setTimeout(() => {
        triggerSearch(inputValue);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [inputValue, committedSearchTerm, triggerSearch]);
  
  const handleCategorySelect = (categoryId: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId) params.set('categoryId', categoryId);
    else params.delete('categoryId');
    updateSearchParams(params);
  };

  const handleSortOrderChange = (order: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', order);
    updateSearchParams(params);
  };

  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      // 디바운스 중인 검색이 있다면 취소하고 즉시 검색 실행
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      triggerSearch(inputValue);
    }
  };

  const handleClearSearchTerm = () => {
    setInputValue('');
    triggerSearch('');
  };

  const selectedCategoryId = selectedCategory ? parseInt(selectedCategory, 10) : null;

  return (
    <main className="min-h-screen w-full pt-20">
      <div
        className={`fixed z-5 w-[calc(100%-32px)] bg-white transition duration-300 ease-in-out ${
          isSearchingVisible ? 'translate-y-0 pb-4 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <Searching
          categories={categories}
          selectedCategory={selectedCategoryId}
          onSelectCategory={handleCategorySelect}
          sortOrder={sortOrder}
          onSortOrderChange={handleSortOrderChange}
          searchTerm={inputValue}
          onSearchTermChange={handleSearchTermChange}
          onClearSearchTerm={handleClearSearchTerm}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="pt-15">
        <Suspense fallback={<div>Loading...</div>}>
          <View data={products} />
        </Suspense>
      </div>

      {/* 무한스크롤 로딩 인디케이터 */}
      {hasMore && (
        <div ref={observerRef} className="flex justify-center py-8">
          {isLoadingMore && <p>Loading more...</p>}
        </div>
      )}
    </main>
  );
}
