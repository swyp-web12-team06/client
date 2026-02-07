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
  };
  createdAt: string;
  updatedAt: string;
};
