const STATUS_ENDPOINT_PATH = '/image/status'; // TODO: 문서에 나온 실제 path로 수정

type ImageStatus = 'PROCESSING' | 'COMPLETED' | 'FAILED';

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

/** image_id로 1회 상태 조회 */
export async function getImageStatusOnce(
  imageId: number,
  accessToken?: string,
): Promise<ImageStatusItem | null> {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE}/image/${imageId}/status`);
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
    return json?.data?.[0] ?? null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

type PollOptions = {
  intervalMs?: number; // 기본 1500ms
  timeoutMs?: number; // 기본 60초
};

/** status가 COMPLETED 될 때까지 폴링 */
export async function pollImageUntilCompleted(
  imageId: number,
  accessToken?: string,
  opts: PollOptions = {},
): Promise<ImageStatusItem> {
  const intervalMs = opts.intervalMs ?? 1500;
  const timeoutMs = opts.timeoutMs ?? 60_000;
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
