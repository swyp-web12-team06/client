import { Product } from '@/type/product';
import ProductDetailModal from './ProductDetailModal';
import { useState } from 'react';
import Select from '@/components/commons/Select';
import ProductEditModal from '@/app/_components/ProductEditModal';
import { useAuth } from '@/context/AuthContext';
import { activeProductHandler, httpClient } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function Lookbook({ data, userId }: { data: Product[]; userId?: string }) {
  const { accessToken } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isProductEditModalOpen, setIsProductEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const router = useRouter();

  function handleProductDetail(p: Product) {
    setProduct(p);
    setIsOpen(true);
  }

  async function handleMenuSelect(value: string, promptId: number) {
    const product = data.find((p) => p.promptId === promptId);
    if (!product) {
      console.error(`Product with ID ${promptId} not found.`);
      return;
    }

    if (!accessToken) {
      alert('로그인이 필요합니다.');
      return;
    }

    switch (value) {
      case 'edit':
        setProductToEdit(product);
        setIsProductEditModalOpen(true);
        break;
      case 'open':
        activeProductHandler(product.promptId, true, accessToken, router);
        break;
      case 'hide':
        const newIsActive = product.userStatus === 'HIDDEN';
        try {
          await httpClient.patch(`/product/${promptId}`, { isActive: newIsActive }, accessToken);
          console.log(product.userStatus);
          alert(`상품이 성공적으로 ${newIsActive ? '보이기' : '숨김'} 처리되었습니다!`);
          window.location.reload();
        } catch (err: any) {
          console.error('Failed to update product status:', err);
          alert(err.message || `상품 상태 변경에 실패했습니다.`);
        }
        break;
      case 'delete':
        if (window.confirm(`${product.title} 상품을 정말 삭제하시겠습니까?`)) {
          try {
            await httpClient.delete(`/product/${promptId}`, accessToken);
            alert('상품이 성공적으로 삭제되었습니다!');
            router.refresh();
          } catch (err: any) {
            console.error('Product deletion failed:', err);
            alert(err.message || '상품 삭제에 실패했습니다.');
          }
        }
        break;
    }
  }

  const userIdNumber = Number(userId);

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {data.map((p) => {
        // 데이터가 없는 상품은 렌더링 제외
        if (!p.representativeImageUrls || p.representativeImageUrls.length === 0) {
          return (
            <div
              key={p.promptId}
              className="flex cursor-pointer divide-x divide-gray-300 overflow-hidden rounded-2xl border border-gray-300 bg-gray-400"
            >
              <div className="flex h-54 w-full items-center justify-center rounded-2xl border border-gray-300 bg-gray-400 text-gray-500">
                <span>No Image Available</span>
              </div>
            </div>
          );
        }

        return (
          <div
            key={p.promptId}
            className="group relative flex cursor-pointer divide-x divide-gray-300 overflow-hidden rounded-2xl border border-gray-300 bg-gray-400"
          >
            {p.representativeImageUrls.slice(0, 3).map((imageUrl, index) => (
              <div key={`${p.promptId}-${index}`} className="relative h-54 w-full">
                <img
                  src={imageUrl}
                  alt={`${p.title} lookbook image ${index + 1}`}
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </div>
            ))}

            <div
              onClick={() => handleProductDetail(p)}
              className="absolute top-0 left-0 z-1 flex h-full w-full translate-y-full items-end bg-linear-to-t from-gray-900/50 to-transparent px-5 pb-3 transition group-hover:translate-y-0"
            >
              {p.seller && p.seller.id === userIdNumber && (
                <div onClick={(e) => e.stopPropagation()} className="absolute top-8 right-4.5">
                  <Select
                    items={[
                      { label: '수정', value: 'edit' },
                      { label: p.userStatus !== 'HIDDEN' ? '숨김' : '보이기', value: 'hide' },
                      { label: '삭제', value: 'delete' },
                    ]}
                    value={undefined}
                    className="h-6! w-6! justify-center! rounded-none border-none bg-transparent! p-0!"
                    onValueChange={(value: string) => handleMenuSelect(value, p.promptId)}
                  />
                </div>
              )}
              <div>
                <span className="typo-caption-medium rounded-sm bg-gray-900 px-2 py-1 text-gray-50">
                  {p.price} C
                </span>
                <p className="typo-body2-medium mt-2 text-gray-50">
                  {p.title} #{p.promptId}
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
      <ProductEditModal
        isOpen={isProductEditModalOpen}
        onClose={() => setIsProductEditModalOpen(false)}
        product={productToEdit}
        onProductUpdated={() => {
          setIsProductEditModalOpen(false);
          router.refresh();
        }}
      />
    </div>
  );
}
