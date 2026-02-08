'use client';

import Image from 'next/image';
import Settings from '../_components/Settings';
import { getImageDownloadInfo, getProductForPurchase } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { ProductForPurchase } from '@/type/product';
import { useParams } from 'next/navigation';
import { Button } from '@/components/commons/Button';

export default function Studio() {
  const params = useParams<{ id: string }>();
  const { accessToken, isLoading, isLoggedIn, login } = useAuth();
  const [data, setData] = useState<ProductForPurchase | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [imageId, setImageId] = useState<number>(0);

  useEffect(() => {
    if (!accessToken) return;

    const fetchData = async () => {
      const result = await getProductForPurchase(params.id, accessToken);
      setData(result);
    };

    fetchData();
  }, [accessToken, params.id]);

  async function downloadWithSavePicker() {
    const info = await getImageDownloadInfo(imageId, accessToken ?? undefined);
    const url = info?.download_url;
    if (!url) throw new Error('download_url이 없습니다.');

    const fileRes = await fetch(url, { cache: 'no-store' });
    if (!fileRes.ok) throw new Error('파일 다운로드 실패');
    const blob = await fileRes.blob();

    const handle = await (window as any).showSaveFilePicker({
      suggestedName: info.file_name ?? `image_${imageId}.png`,
      types: [
        {
          description: 'Image',
          accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/webp': ['.webp'],
          },
        },
      ],
    });

    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
  }

  if (!data) return null;

  return (
    <main className="mt-46 flex w-[70%] gap-15">
      <div className="align-end flex w-full flex-col gap-6">
        <div className="flex w-full justify-center gap-5">
          <div className="flex w-full flex-col">
            <h4 className="typo-body1-semibold">{data.title}</h4>
            <p className="typo-body2-regular line-clamp-7">{data.description}</p>
          </div>

          <div className="relative h-[174px] w-[240px] shrink-0 overflow-hidden bg-gray-400">
            <Image
              src={data?.previewImageUrl}
              alt={data?.title ?? 'product image'}
              fill
              sizes="240px"
              className="object-cover object-center"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
        <Settings
          promptId={data.promptId}
          promptVariables={data.promptVariables}
          aspectRatios={data.modelInfo.aspectRatios}
          resolutions={data.modelInfo.resolutions}
          modelId={data.modelInfo.modelId}
          setGeneratedImageUrl={setGeneratedImageUrl}
          setImageId={setImageId}
        />
      </div>
      <div className="w-full">
        <div className="flex flex-col items-center gap-5">
          <div className="flex w-full justify-between border-b-2 border-gray-400 pb-3">
            <h4 className="typo-heading2-medium">Preview</h4>
            <Button variant="solid" size="sm" onClick={downloadWithSavePicker}>
              Download
            </Button>
          </div>
          {generatedImageUrl ? (
            <div className="bg-tranprentcy h-[588px] w-[588px]">
              <img
                src={generatedImageUrl}
                className="h-full w-full object-contain"
                alt="Generated Image"
              />
            </div>
          ) : (
            <div className="flex h-[588px] w-[588px] items-center justify-center bg-gray-200">
              이미지를 생성해주세요.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
