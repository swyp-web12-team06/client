'use client';

import { Button } from '@/components/commons/Button';
import { getImageDownloadUrl } from '@/lib/api';

export async function downloadImageByRedirect(imageId: number, accessToken?: string) {
  const info = await getImageDownloadUrl(imageId, accessToken);
  if (!info?.download_url) return false;

  // 새 탭으로 열거나
  window.open(info.download_url, '_blank');

  // 같은 탭으로 다운로드 유도하려면:
  // window.location.href = info.download_url;

  return true;
}

export default function GeneratedImage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between border-b-2 border-gray-400 pb-3">
        <h4 className="typo-heading2-medium">Preview</h4>
        <Button variant="solid" size="sm">
          Download
        </Button>
      </div>
      <div className="h-[588px] self-stretch bg-gray-400" />
    </div>
  );
}
