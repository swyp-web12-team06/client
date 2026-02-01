import { Product } from '@/type/product';
import Link from 'next/link';

export default function Lookbook({ data }: { data: Product[] }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {data.map((product) => {
        // 데이터가 없는 상품은 렌더링 제외
        if (!product.representativeImageUrls || product.representativeImageUrls.length === 0) {
          return null;
        }
        return (
          <Link href={`/lookbook/${product.promptId}`} key={product.promptId} className="break-inside-avoid">
            <div className="flex bg-gray-400 divide-x divide-gray-300 overflow-hidden rounded-2xl border border-gray-300">
              {product.representativeImageUrls.slice(0, 3).map((imageUrl, index) => (
                <div key={`${product.promptId}-${index}`} className="relative h-54 w-full">
                  <img
                    src={imageUrl}
                    alt={`${product.title} lookbook image ${index + 1}`}
                    className="object-cover w-full h-full"
                    loading="eager"
                  />
                </div>
              ))}
            </div>
          </Link>
        )
      })}
    </div>
  );
}
