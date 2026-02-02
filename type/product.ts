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
    seller: {
        id: number;
        nickname: string;
    };
    createdAt: string;
    updatedAt: string;
}
