type ImageStatus = 'PROCESSING' | 'COMPLETED' | 'FAILED';

export type ImageDownloadInfo = {
  image_id: number;
  download_url: string;
  file_name: string;
};

export type GeneratedImage = {
  image_id: number;
  image_url: string;
  total_price: number;
  current_credit: number;
};

export type ImageStatusItem = {
  status: ImageStatus;
  imageId: number;
  downloadUrl?: string | null;
};
