'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import { Button } from '@/components/commons/Button';
import Input from '@/components/commons/Input';
import Select, { SelectItem } from '@/components/commons/Select';
import { Product } from '@/type/product';
import { httpClient } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { getCategories } from '@/lib/api';

interface props {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onProductUpdated: () => void;
}

export default function ProductEditModal({ isOpen, onClose, product, onProductUpdated }: props) {
  const { accessToken } = useAuth();
  const [title, setTitle] = useState(product?.title || '');
  const [description, setDescription] = useState(product?.description || '');
  const [categoryId, setCategoryId] = useState<number | undefined>(
    product?.categoryId || undefined,
  );
  const [price, setPrice] = useState(product?.price || 0);
  const [tags, setTags] = useState<string[]>(product?.tags || []);
  const [categories, setCategories] = useState<SelectItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setTitle(product.title || '');
      setDescription(product.description || '');
      setCategoryId(product.categoryId || undefined);
      setPrice(product.price || 0);
      setTags(product.tags || []);
    }
  }, [product]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const fetchedCategories = await getCategories();
        setCategories(
          fetchedCategories.map((cat) => ({
            label: cat.name,
            value: cat.id.toString(),
          })),
        );
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError('카테고리를 불러오는데 실패했습니다.');
      }
    }
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!accessToken) {
      setError('인증 토큰이 없습니다. 다시 로그인해주세요.');
      setIsLoading(false);
      return;
    }
    if (!product?.promptId) {
      setError('수정할 제품 ID가 없습니다.');
      setIsLoading(false);
      return;
    }

    const payload: {
      title?: string;
      description?: string;
      categoryId?: number;
      price?: number;
      tags?: string[];
      previewImageId?: number;
      representativeImageIds?: number[];
    } = {};

    if (title !== product.title) payload.title = title;
    if (description !== product.description) payload.description = description;
    if (categoryId !== product.categoryId) payload.categoryId = categoryId;
    if (price !== product.price) payload.price = price * 100;
    if (JSON.stringify(tags) !== JSON.stringify(product.tags)) payload.tags = tags;

    // product.previewImageUrl을 기반으로 product.images에서 미리보기ImageId 도출
    const newPreviewImage = product.images?.find((img) => img.imageUrl === product.previewImageUrl);
    if (newPreviewImage) {
      payload.previewImageId = newPreviewImage.id;
    }

    // product.presentialImageUrls를 기반으로 product.images에서 대표 이미지 ID를 도출
    const newRepresentativeImageIds =
      product.images
        ?.filter((img) => product.representativeImageUrls?.includes(img.imageUrl))
        .map((img) => img.id) || [];
    payload.representativeImageIds = newRepresentativeImageIds;

    // 변경 사항이 있을 경우에만 보내기
    if (Object.keys(payload).length === 0) {
      onClose();
      setIsLoading(false);
      return;
    }

    try {
      await httpClient.patch(`/product/${product.promptId}`, payload, accessToken);
      onProductUpdated();
      onClose();
      alert('상품이 성공적으로 수정되었습니다!');
    } catch (err: any) {
      console.error('Product update failed:', err);
      setError(err.response?.data?.message || '상품 수정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <h2 className="typo-heading2-semibold mb-6 text-gray-800">상품 수정</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            id="title"
            label="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="상품 제목"
            variant="secondary"
            size="small"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="typo-body2-semibold mb-2 block text-gray-700">
            설명
          </label>
          <textarea
            id="description"
            className="focus-within:border-primary-200 min-h-30 w-full rounded-lg border border-gray-500 bg-gray-100 px-4.75 py-2.5 text-gray-800 outline-none placeholder:text-gray-500 hover:border-gray-800 disabled:bg-gray-300 has-[input:disabled]:hover:border-gray-500"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="상품 설명을 입력해주세요"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="typo-body2-semibold mb-2 block text-gray-700">
            카테고리
          </label>
          <Select
            items={categories}
            value={categoryId?.toString()}
            onValueChange={(value) => setCategoryId(parseInt(value))}
          />
        </div>

        <div className="mb-4">
          <Input
            id="price"
            type="number"
            label="가격"
            size="small"
            placeholder="가격"
            value={price * 100}
            onChange={(e) => setPrice((parseInt(e.target.value) || 0) / 100)}
            className="w-full"
            variant="secondary"
            sideLabel="C"
            min={500}
            max={1000}
            step={100}
            required
          />
        </div>

        <div className="mb-6">
          <Input
            id="tags"
            label="태그 (쉼표로 구분)"
            value={tags.join(', ')}
            onChange={(e) => setTags(e.target.value.split(',').map((tag) => tag.trim()))}
            placeholder="태그를 입력해주세요 (예: 고양이, 사이버펑크)"
            variant="secondary"
            size="small"
          />
        </div>

        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" size="md" onClick={onClose} disabled={isLoading}>
            취소
          </Button>
          <Button type="submit" size="md" disabled={isLoading}>
            {isLoading ? '저장 중...' : '저장'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
