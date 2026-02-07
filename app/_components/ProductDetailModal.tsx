'use client';

import { Button } from '@/components/commons/Button';
import { Product } from '@/type/product';
import { useEffect } from 'react';

export default function ProductDetailModal({
  isOpen,
  product,
  setIsOpen,
}: {
  isOpen: boolean;
  product: Product | null;
  setIsOpen: (open: boolean) => void;
}) {
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

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <div onClick={(e) => e.stopPropagation()} className="relative h-full w-full">
          {product && (
            <>
              <div className="relative h-full w-full">
                {/*스크롤 영역*/}
                <div className="mx-auto h-full w-[70%] overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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

                {/* 사이드 버튼*/}
                <div className="pointer-events-auto absolute top-60 right-[calc(15%_-_64px)] z-40 -translate-y-1/2">
                  <div className="flex flex-col gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <button
                        key={i}
                        className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-gray-400 bg-gray-200 text-gray-500"
                      >
                        <span className="text-xs">
                          {i === 1 ? '팔로우' : i === 2 ? '좋아요' : i === 3 ? '저장' : '공유'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/*이전/다음 버튼 */}
                <button
                  className="absolute bottom-6 left-[calc(15%_-_64px)] z-50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-gray-700 bg-gray-200 text-gray-500"
                  onClick={() => console.log('이전 이미지')}
                >
                  <span className="text-2xl">❮</span>
                </button>

                <button
                  className="absolute right-[calc(15%_-_64px)] bottom-6 z-50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-gray-400 bg-gray-200 text-gray-500"
                  onClick={() => console.log('다음 이미지')}
                >
                  <span className="text-2xl">❯</span>
                </button>
              </div>

              <div className="pointer-events-auto absolute bottom-6 left-1/2 z-30 flex w-[30%] -translate-x-1/2 items-center justify-between gap-4 rounded-2xl border border-white/20 bg-gray-900/80 p-4 shadow-2xl backdrop-blur-xl">
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
                  <Button>장바구니</Button>
                  <Button size="sm">구매하기</Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
