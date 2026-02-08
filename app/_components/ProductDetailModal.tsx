'use client';

import { Button } from '@/components/commons/Button';
import { Product } from '@/type/product';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import Link from 'next/link';
import FavouriteIcon from '@/public/icon/favourite.svg';
import HeartIcon from '@/public/icon/heart.svg';
import LinkExternalIcon from '@/public/icon/link-external.svg';

export default function ProductDetailModal({
  isOpen,
  product,
  setIsOpen,
  setProduct,
  currentIdx,
  setCurrentIdx,
  data,
}: {
  isOpen: boolean;
  product: Product | null;
  setIsOpen: (open: boolean) => void;
  setProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  currentIdx: number;
  setCurrentIdx: Dispatch<SetStateAction<number>>;
  data: Product[];
}) {
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalPaddingRight = document.body.style.paddingRight;

    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      document.body.style.paddingRight = originalPaddingRight;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => setIsOpen(false);

  const handleController = (isNext: boolean) => {
    if (!data?.length) return;
    if (currentIdx < 0 || currentIdx >= data.length) return;

    const nextIdx = isNext ? currentIdx + 1 : currentIdx - 1;
    if (nextIdx < 0 || nextIdx >= data.length) return;

    setCurrentIdx(nextIdx);
    setProduct(data[nextIdx]);
  };

  const isPrevDisabled = currentIdx <= 0;
  const isNextDisabled = !data?.length || currentIdx >= data.length - 1;

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        // ✅ “진짜 컨텐츠 박스(contentRef)” 밖이면 닫기
        if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
          handleClose();
        }
      }}
    >
      {/* 회색 오버레이 */}
      <div className="absolute inset-0 bg-black/40" />

      {/* ✅ 화면 중앙 레이아웃(컨텐츠 박스 기준) */}
      <div className="relative z-10 h-full w-full">
        {/* ✅ 이게 진짜 모달 컨텐츠 영역(70%) — 여기만 ref 걸기 */}
        <div ref={contentRef} className="relative mx-auto h-full w-[70%]">
          {product && (
            <>
              {/* 스크롤 영역 */}
              <div className="h-full overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex items-center gap-2 px-5 py-4">
                  <div className="h-[40px] w-[40px] rounded-full bg-gray-400" />
                  <p className="typo-body1-medium text-white">{product.seller.nickname}</p>
                </div>

                <div className="flex flex-col gap-2 rounded-tl-xl rounded-tr-xl bg-white p-5">
                  <p className="typo-heading2-semibold w-full text-gray-900">{product.title}</p>
                  <p className="typo-body2-regular line-clamp-2 w-full text-gray-600">
                    {product.description}
                  </p>
                </div>

                <div className="flex flex-col">
                  {product.images?.map((image, idx) => (
                    <div key={image.id || idx} className="relative w-full">
                      <img src={image.imageUrl} className="w-full object-cover" alt="" />
                      <div className="absolute top-4 left-1/2 flex -translate-x-1/2 gap-2">
                        {Object.values(image.optionValues).map(
                          (value, vIdx) =>
                            value && (
                              <span
                                key={vIdx}
                                className="typo-body2-semibold inline-flex items-center justify-center rounded-full border border-gray-500 bg-gray-300/80 px-4 py-2 text-gray-800 backdrop-blur-sm"
                              >
                                <span className="truncate">{value}</span>
                              </span>
                            ),
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 사이드 버튼 (컨텐츠 박스 기준으로 배치) */}
              <div className="pointer-events-auto absolute top-60 -right-16 z-40 -translate-y-1/2">
                <div className="flex flex-col gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <button
                      key={i}
                      className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-gray-400 bg-gray-200 text-gray-500"
                    >
                      {i === 1 ? null : i === 2 ? (
                        <HeartIcon className="h-6 w-6" />
                      ) : i === 3 ? (
                        <FavouriteIcon className="h-6 w-6" />
                      ) : (
                        <LinkExternalIcon className="h-6 w-6" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 이전/다음 버튼 (컨텐츠 박스 기준) */}
              <button
                disabled={isPrevDisabled}
                className="absolute bottom-6 -left-16 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-gray-700 bg-gray-200 text-gray-500 disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => handleController(false)}
              >
                <span className="text-2xl">❮</span>
              </button>

              <button
                disabled={isNextDisabled}
                className="absolute -right-16 bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-gray-400 bg-gray-200 text-gray-500 disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => handleController(true)}
              >
                <span className="text-2xl">❯</span>
              </button>

              {/* 하단 바 (컨텐츠 박스 기준) */}
              <div className="pointer-events-auto absolute bottom-6 left-1/2 z-30 flex w-[45%] -translate-x-1/2 items-center justify-between gap-4 rounded-2xl border border-white/20 bg-gray-900/80 p-4 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="h-[48px] w-[48px] rounded-full border border-gray-500 bg-gray-600" />
                  <div className="flex flex-col text-white">
                    <span className="text-xs text-gray-400">Total Price</span>
                    <span className="typo-body1-bold text-lg">
                      {product.price.toLocaleString()} C
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    팔로우
                  </Button>
                  <Link href={`/studio/${product.promptId}`}>
                    <Button size="sm">구매하기</Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
