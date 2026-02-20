type Image = {
  id: number;
  imageUrl: string;
  isPreview: boolean;
  isRepresentative: boolean;
  optionValues: {
    [key: string]: string;
  };
};

export type Product = {
  promptId: number;
  title: string;
  description: string;
  price: number;
  userStatus: string;
  categoryId: number;
  categoryName: string;
  modelId: number;
  modelName: string;
  previewImageUrl: string;
  representativeImageUrls: string[];
  tags: string[];
  images: Image[];
  seller: {
    id: number;
    nickname: string;
    profileImageUrl: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type PromptVariables = {
  id: number;
  keyName: string;
  description: string;
  orderIndex: number;
};

export type ProductForPurchase = {
  promptId: number;
  title: string;
  description: string;
  previewImageUrl: string;
  modelInfo: {
    modelId: number;
    modelName: string;
    aspectRatios: string[];
    resolutions: null;
  };
  promptVariables: PromptVariables[];
};

export type SalesItem = {
  prompt_id: number;
  title: string;
  price: number;
  preview_image_url: string;
  status: string;
  sales_count: number;
  total_revenue: number;
  created_at: string;
};

// 타인 판매 목록 API 응답 인터페이스
export interface SalesItemFromApi {
  prompt_id: number;
  title: string;
  price: number;
  preview_image_url: string;
  status: string;
  created_at: string;
  sales_count: number;
  total_revenue: number;
}
