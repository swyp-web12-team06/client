type ImageStatus = 'PROCESSING' | 'COMPLETED' | 'FAILED';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || '';

type ImageStatusItem = {
  status: ImageStatus;
  imageId: number;
  downloadUrl?: string | null;
};

type ApiResponse<T> = {
  code: string;
  message: string;
  data: T;
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function getImageStatusOnce(imageId: number, accessToken?: string): Promise<any> {
  try {
    const url = new URL(`${API_BASE_URL}/image/${imageId}/status`);
    url.searchParams.set('imageId', String(imageId));

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken ?? ''}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(res.status, await res.text());
      return null;
    }

    const json = (await res.json()) as ApiResponse<ImageStatusItem[]>;
    console.log('json', json);
    return json?.data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

type PollOptions = {
  intervalMs?: number; //  1500ms
  timeoutMs?: number; //  60초
};

export async function pollImageUntilCompleted(
  imageId: number,
  accessToken?: string,
  opts: PollOptions = {},
): Promise<ImageStatusItem> {
  const intervalMs = opts.intervalMs ?? 1500;
  const timeoutMs = opts.timeoutMs ?? 300_000;
  const start = Date.now();

  while (true) {
    const item = await getImageStatusOnce(imageId, accessToken);

    if (item?.status === 'COMPLETED') return item;
    if (item?.status === 'FAILED') throw new Error('이미지 생성 실패(FAILED)');

    console.log(item);

    if (Date.now() - start > timeoutMs) {
      throw new Error('폴링 타임아웃');
    }

    await sleep(intervalMs);
  }
}
