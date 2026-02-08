import { Category } from '@/type/category';

import { PaginatedProducts } from '@/type/paginate';
import { ProductForPurchase } from '@/type/product';
import { Balance, Options } from '@/type/credit';
import { GeneratedImage, ImageDownloadInfo } from '@/type/image';

const TOKEN = process.env.NEXT_PUBLIC_TEST_TOKEN || '';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || '';

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

export async function getProductForPurchase(
  promptId: string,
  accessToken: string,
): Promise<ProductForPurchase> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/product/${promptId}/purchase`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    });

    if (!res.ok) {
      console.error(res.status, await res.text());
      return {} as ProductForPurchase;
    }
    const data = await res.json();
    return data.data || ({} as ProductForPurchase);
  } catch (error) {
    console.error(error);
    return {} as ProductForPurchase;
  }
}

export async function getPriceEstimate(
  promptId: number,
  body: {
    modelId: number;
    aspectRatio: string;
    resolution: string;
  },
  accessToken: string,
): Promise<number> {
  const res = await fetch(`${API_BASE_URL}/product/${promptId}/estimate`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`estimate failed: HTTP ${res.status} ${text}`);
  }

  const json: { code: string; message: string; data: number } = await res.json();

  if (json.code !== 'SUCCESS') {
    throw new Error(json.message || 'estimate failed');
  }

  if (typeof json.data !== 'number') {
    throw new Error('estimate response data is not a number');
  }

  return json.data;
}

export async function generateImage(
  promptId: number,
  body: {
    aspect_ratio: string;
    resolution: string;
    variable_value: any;
  },
  accessToken?: string,
): Promise<GeneratedImage | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/product/${promptId}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorDetail = await res.text();
      console.error(`[API Error ${res.status}]:`, errorDetail);
      return null;
    }

    const response = await res.json();
    console.log('Server Response:', response);

    return response.data || response;
  } catch (error) {
    console.error('Network Error:', error);
    return null;
  }
}

export async function getCreditOptions(): Promise<Options[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/credit/options`, {
      cache: 'force-cache',
    });
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

export async function getCreditBalance(accessToken?: string): Promise<Balance> {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/credit/balance`, {
      cache: 'force-cache',
      headers,
    });
    if (!res.ok) {
      console.error(res.status, await res.text());
      return { currentCredit: 0 };
    }
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error(error);
    return { currentCredit: 0 };
  }
}

export async function getImageDownloadUrl(
  imageId: number,
  accessToken?: string,
): Promise<ImageDownloadInfo | null> {
  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken ?? ''}`,
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/image/${imageId}/download`, {
      headers,
    });

    if (!res.ok) {
      console.error(res.status, await res.text());
      return null;
    }

    const json = await res.json();
    return json?.data ?? null;
  } catch (error) {
    console.error(error);
    return null;
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
