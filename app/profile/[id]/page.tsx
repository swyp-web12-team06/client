import { httpClient } from '@/lib/api';
import { Product, SalesItemFromApi } from '@/type/product';
import { User } from '@/type/user';
import { Suspense } from 'react';
import UserProfileClient from './UserProfileClient';

interface props {
  params: { id: string };
}

// API 응답을 Product 타입으로 변환하는 함수
const transformSalesItemToProduct = (item: SalesItemFromApi, profileUser: User): Product => {
  return {
    promptId: item.prompt_id,
    title: item.title,
    description: '',
    price: item.price,
    userStatus: item.status,
    categoryId: 0,
    categoryName: '',
    modelId: 0,
    modelName: '',
    representativeImageUrls: item.preview_image_url ? [item.preview_image_url] : [],
    previewImageUrl: item.preview_image_url,
    tags: [],
    images: item.preview_image_url
      ? [
          {
            id: item.prompt_id,
            imageUrl: item.preview_image_url,
            isPreview: true,
            isRepresentative: true,
            optionValues: {},
          },
        ]
      : [],
    seller: {
      id: profileUser.userId,
      nickname: profileUser.nickname || '',
      profileImageUrl: profileUser.profileImageUrl || '',
    },
    createdAt: item.created_at,
    updatedAt: item.created_at,
  };
};

async function getUserProfile(userId: string): Promise<User | null> {
  try {
    const res = await httpClient.get<{ data: User }>(`/user/${userId}`);
    return res.data;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    return null;
  }
}

async function getUserProducts(
  userId: string,
  page: number = 0,
  profileUser: User,
): Promise<{ content: Product[]; last: boolean } | null> {
  const pageSize = 10;
  try {
    const res = await httpClient.get<{ data: SalesItemFromApi[] }>(
      `/product/user/${userId}?page=${page}&size=${pageSize}`,
    );
    const salesItems = res.data;
    const transformedProducts = salesItems.map((item) =>
      transformSalesItemToProduct(item, profileUser),
    );
    const isLastPage = transformedProducts.length < pageSize;

    return { content: transformedProducts, last: isLastPage };
  } catch (error) {
    console.error('Failed to fetch user products:', error);
    return null;
  }
}

export default async function UserProfilePage({ params }: props) {
  const { id } = await params;

  const user = await getUserProfile(id);
  if (!user) {
    console.error(`찾을 수 없는 유저 ID: ${id}에 대한 프로필을 가져오지 못했습니다.`);
    return (
      <div className="flex min-h-screen items-center justify-center">
        해당 유저를 찾을 수 없습니다.
      </div>
    );
  }
  const productsData = await getUserProducts(id, 0, user); // 첫 페이지의 상품 데이터 가져오기

  console.log(`Fetched user profile for userId ${id}:`, user);
  console.log(`Fetched products for userId ${id}:`, productsData);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserProfileClient
        user={user}
        initialProducts={productsData?.content || []}
        isLastPage={productsData?.last ?? true}
      />
    </Suspense>
  );
}
