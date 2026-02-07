import { Product } from '@/type/product';
import ProductDetailModal from './ProductDetailModal';
import { useState } from 'react';

export default function Lookbook({ data }: { data: Product[] }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  function handleProductDetail(p: Product) {
    setProduct(p);
    setIsOpen(true);
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {data.map((p) => {
        if (!p.representativeImageUrls?.length) return null;

        return (
          <div
            key={p.promptId}
            className="flex cursor-pointer divide-x divide-gray-300 overflow-hidden rounded-2xl border border-gray-300 bg-gray-400"
            onClick={() => handleProductDetail(p)}
          >
            {p.representativeImageUrls.slice(0, 3).map((imageUrl, index) => (
              <div key={`${p.promptId}-${index}`} className="relative h-[216px] w-full">
                <img
                  src={imageUrl}
                  alt={`${p.title} lookbook image ${index + 1}`}
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </div>
            ))}
          </div>
        );
      })}

      <ProductDetailModal isOpen={isOpen} product={product} setIsOpen={setIsOpen} />
    </div>
  );
}
