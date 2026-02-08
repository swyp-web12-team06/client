import { Product } from '@/type/product';
import Link from 'next/link';
import { useState } from 'react';
import ProductDetailModal from './ProductDetailModal';

export default function Gallery({ data }: { data: Product[] }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  function handleProductDetail(p: Product, idx: number) {
    setProduct(p);
    setIsOpen(true);
    console.log(idx);
    setCurrentIdx(idx);
  }

  return (
    <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
      {data.map((product, idx) => {
        return (
          <div
            key={product.promptId}
            className="group relative mb-4 break-inside-avoid overflow-hidden rounded-xl"
            onClick={() => handleProductDetail(product, idx)}
          >
            <img
              src={product.previewImageUrl}
              alt={product.title}
              className="h-full w-full bg-gray-500 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        );
      })}
      <ProductDetailModal
        isOpen={isOpen}
        product={product}
        setIsOpen={setIsOpen}
        setProduct={setProduct}
        currentIdx={currentIdx}
        setCurrentIdx={setCurrentIdx}
        data={data}
      />
    </div>
  );
}
