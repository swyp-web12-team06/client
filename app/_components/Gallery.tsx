import { Product } from '@/type/product';
import Link from 'next/link';
import { useState } from 'react';
import ProductDetailModal from './ProductDetailModal';

export default function Gallery({ data }: { data: Product[] }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  function handleProductDetail(p: Product) {
    setProduct(p);
    setIsOpen(true);
  }

  return (
    <div className="columns-2 gap-4 space-y-4 md:columns-3 lg:columns-4">
      {data.map((product) => {
        return (
          <div
            key={product.promptId}
            className="group relative break-inside-avoid overflow-hidden rounded-xl"
            onClick={() => handleProductDetail(product)}
          >
            <img
              src={product.previewImageUrl}
              alt={product.title}
              className="bg-gray-200 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        );
      })}
      <ProductDetailModal isOpen={isOpen} product={product} setIsOpen={setIsOpen} />
    </div>
  );
}
