import { Category } from '@/type/category';
import { PaginatedProducts } from '@/type/paginate';

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/metadata/categories`, {
      cache: 'force-cache',
    });
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

export async function getProducts(searchParams: {
  [key: string]: string | string[] | undefined;
}): Promise<PaginatedProducts> {
  const params = new URLSearchParams();

  if (searchParams.keyword) {
    params.append('keyword', String(searchParams.keyword));
  }
  if (searchParams.categoryId) {
    params.append('categoryId', String(searchParams.categoryId));
  }
  if (searchParams.sort) {
    const sortMap: { [key: string]: string } = {
      new: 'LATEST',
      old: 'OLDEST',
      low: 'PRICE_LOW',
      high: 'PRICE_HIGH',
    };
    const apiSort = sortMap[String(searchParams.sort).toLowerCase()] || 'LATEST';
    params.append('sort', apiSort);
  }
  if (searchParams.page) {
    params.append('page', String(searchParams.page));
  }

  params.append('size', String(searchParams.size || '12'));

  const url = `${process.env.NEXT_PUBLIC_API_BASE}/product?${params.toString()}`;

  try {
    // 'no-store'를 사용하여 모든 요청에 대해 데이터가 새로워지도록 합니다.
    const res = await fetch(url, { cache: 'no-store' });

    if (!res.ok) {
      console.error(res.status, await res.text());
      return {
        content: [],
        totalPages: 0,
        totalElements: 0,
        last: true,
        size: 0,
        number: 0,
        numberOfElements: 0,
        first: true,
        empty: true,
      };
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error(error);
    return {
      content: [],
      totalPages: 0,
      totalElements: 0,
      last: true,
      size: 0,
      number: 0,
      numberOfElements: 0,
      first: true,
      empty: true,
    };
  }
}

export const httpClient = {
  get: async function <T>(path: string, token?: string): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}${path}`, {
      method: 'GET',
      headers: headers,
      credentials: 'include',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    return response.json();
  },
  post: async function <T>(path: string, token?: string, body?: any): Promise<T> {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const options: RequestInit = {
      method: 'POST',
      headers: headers,
      credentials: 'include',
    };
    if (body) {
      options.body = JSON.stringify(body);
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}${path}`, options);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    return response.json();
  },

  patch: async function <T>(path: string, body?: any, token?: string): Promise<T> {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const options: RequestInit = {
      method: 'PATCH',
      headers: headers,
      credentials: 'include',
    };
    if (body) {
      options.body = JSON.stringify(body);
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}${path}`, options);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    return response.json();
  },

  delete: async function <T>(path: string, token?: string): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}${path}`, {
      method: 'DELETE',
      headers: headers,
      credentials: 'include',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    return response.json();
  },
};

export async function upgradeToSeller(token: string, agreeToSellerTerms: boolean): Promise<any> {
  return httpClient.post('/user/upgrade-seller', token, { agreeToSellerTerms });
}
