import { httpClient } from '@/lib/api';
import { ImageDownloadInfo } from '@/type/image';

export const downloadImageWithUrl = async (imageUrl: string) => {
  window.open(imageUrl, '_blank');
};

export const downloadImageWithImageId = async (imageId: number, accessToken: string) => {
  const imageDownloadInfoResult = await httpClient.get<{ data: ImageDownloadInfo }>(
    `/image/${imageId}/download`,
    accessToken,
  );
  downloadImageWithUrl(imageDownloadInfoResult.data.download_url);
};
