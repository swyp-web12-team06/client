import { Product } from '@/type/product';
import { useState } from 'react';
import ProductDetailModal from './ProductDetailModal';
import Image from 'next/image';

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
    <div className="columns-2 gap-4 md:columns-3">
      {data.map((product, idx) => {
        return (
          <div
            key={product.promptId}
            className="group relative mb-4 cursor-pointer break-inside-avoid overflow-hidden rounded-xl"
            onClick={() => handleProductDetail(product, idx)}
          >
            <Image
              width={400}
              height={400}
              src={product.previewImageUrl}
              alt={product.title}
              className="h-full w-full bg-gray-500 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-0 left-0 z-1 flex h-full w-full translate-y-full items-end bg-linear-to-t from-gray-900/50 to-transparent px-5 pb-3 transition group-hover:translate-y-0">
              <div>
                <span className="typo-caption-medium rounded-sm bg-gray-900 px-2 py-1 text-gray-50">
                  {product.price} C
                </span>
                <p className="typo-body2-medium mt-2 text-gray-50">
                  {product.title} #{product.promptId}
                </p>
              </div>
            </div>
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
