import { Category } from '@/type/category';
import { PaginatedProducts } from '@/type/paginate';
import { ProductForPurchase } from '@/type/product';

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

export async function getProductForPurchase(promptId: string): Promise<ProductForPurchase> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/product/${promptId}/purchase`, {
      cache: 'force-cache',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!res.ok) {
      console.error(res.status, await res.text());
      return {} as ProductForPurchase;
    }
    const data = await res.json();
    return data.data || {};
  } catch (error) {
    console.error(error);
    return {} as ProductForPurchase;
  }
}

export async function getPriceEstimate(
  promptId: string,
  body: {
    modelId: number;
    aspectRatio: string;
    resolution: string;
  },
): Promise<number> {
  const res = await fetch(`${API_BASE_URL}/product/${promptId}/estimate`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
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

export async function createImage(
  promptId: string,
  body: {
    variable_value: number;
    aspect_ratio: string;
    resolution: string;
  },
): Promise<number> {
  const res = await fetch(`${API_BASE_URL}/product/${promptId}/estimate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
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
