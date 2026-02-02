import { Category } from "@/type/category";
import { PaginatedProducts } from "@/type/paginate";

const API_BASE_URL = 'http://localhost:8080';

export async function getCategories(): Promise<Category[]> {
    try {
        const res = await fetch(`${API_BASE_URL}/metadata/categories`, { cache: 'force-cache' });
        // '카테고리 목록' 자주 변경되지 않는 정적인 데이터이므로 'force-cache' 사용
        if (!res.ok) {
            console.error(res.status, await res.text());
            return [];
        }
        const data = await res.json();
        return data.data || [];
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getProducts(searchParams: { [key: string]: string | string[] | undefined }): Promise<PaginatedProducts> {
    const params = new URLSearchParams();

    if (searchParams.keyword) {
        params.append('keyword', String(searchParams.keyword));
    }
    if (searchParams.categoryId) {
        params.append('categoryId', String(searchParams.categoryId));
    }
    if (searchParams.sort) {
        const sortMap: { [key: string]: string } = {
            'new': 'LATEST',
            'old': 'OLDEST',
            'low': 'PRICE_LOW',
            'high': 'PRICE_HIGH',
        };
        const apiSort = sortMap[String(searchParams.sort).toLowerCase()] || 'LATEST';
        params.append('sort', apiSort);
    }
    if (searchParams.page) {
        params.append('page', String(searchParams.page));
    }

    params.append('size', String(searchParams.size || '12'));

    const url = `${API_BASE_URL}/product?${params.toString()}`;
    
    try {
        // 'no-store'를 사용하여 모든 요청에 대해 데이터가 새로워지도록 합니다.
        const res = await fetch(url, { cache: 'no-store' });

        if (!res.ok) {
            console.error(res.status, await res.text());
            return { content: [], totalPages: 0, totalElements: 0, last: true, size: 0, number: 0, numberOfElements: 0, first: true, empty: true };
        }
        
        const data = await res.json();
        return data.data;
    } catch (error) {
        console.error(error);
        return { content: [], totalPages: 0, totalElements: 0, last: true, size: 0, number: 0, numberOfElements: 0, first: true, empty: true };
    }
}
