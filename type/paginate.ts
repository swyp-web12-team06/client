import { Product } from "./product";

export type PaginatedProducts = {
    content: Product[];
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    numberOfElements: number;
    first: boolean;
    empty: boolean;
}