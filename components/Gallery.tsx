import { Product } from '@/type/product';
import Link from 'next/link';
import { useMemo } from 'react';

export default function Gallery({ data }: { data: Product[] }) {
  // 매소너리 ui구현을 위한 랜덤 높이 함수
  const randomHeights = useMemo(() => {
    const arr = [300, 350, 400, 450, 500, 550, 600];
    return data.map(() => arr[Math.floor(Math.random() * arr.length)]);
  }, [data]);

  return (
    <div className="columns-2 gap-4 space-y-4 md:columns-3 lg:columns-4">
      {data.map((product, index) => {
        return (
          <div
            key={product.promptId}
            className="group relative break-inside-avoid overflow-hidden rounded-xl"
            style={{ height: randomHeights[index] }}
          >
            <Link href={`/lookbook/${product.promptId}`} key={product.promptId} className="break-inside-avoid">
            <img
              src={product.previewImageUrl}
              alt={product.title}
              className="bg-gray-200 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gray-400 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
            <div className="absolute bottom-0 left-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="font-bold">{product.title}</p>
              <p className="text-sm">{product.seller.nickname}</p>
            </div>
            </Link>
          </div>
        )
      })}
    </div>
  );
}
