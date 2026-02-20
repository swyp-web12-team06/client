'use client';

import Image from 'next/image';
import Settings from '../_components/Settings';
import { httpClient } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { ProductForPurchase } from '@/type/product';
import { useParams } from 'next/navigation';
import { Button } from '@/components/commons/Button';
import { downloadImageWithImageId } from '@/app/utils/downloadImage';
import Placeholder from '@/components/commons/Placeholder';
import Skeleton from '@/components/commons/Skeleton';

export default function Studio() {
  const params = useParams<{ id: string }>();
  const { accessToken, isLoggedIn, login } = useAuth();
  const [data, setData] = useState<ProductForPurchase | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [imageId, setImageId] = useState<number>(0);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [isImgLoading, setIsImgLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!accessToken) return;
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const productResult = await httpClient.get<{ data: ProductForPurchase }>(
          `/product/${params.id}/purchase`,
          accessToken,
        );
        setData(productResult.data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [accessToken, params.id]);

  const handleDownloadImage = async (imageId: number) => {
    if (!imageId || !accessToken) return;
    downloadImageWithImageId(imageId, accessToken);
  };

  if (!data) return null;

  return (
    <main className="mt-46 flex w-full flex-wrap gap-15 md:w-[70%] lg:w-[70%] lg:flex-nowrap">
      <div className="align-end flex w-full flex-col gap-6">
        <div className="flex w-full justify-center gap-5">
          <div className="flex w-full flex-col">
            {isLoading ? (
              <Skeleton variant="text" lines={4} />
            ) : (
              <>
                <h4 className="typo-body1-semibold">{data.title}</h4>
                <p className="typo-body2-regular line-clamp-7">{data.description}</p>
              </>
            )}
          </div>

          <div className="relative h-43.5 w-60 shrink-0">
            {isLoading ? (
              <Skeleton />
            ) : (
              <Image
                src={data.previewImageUrl}
                alt={data.title}
                fill
                className="object-cover object-center"
              />
            )}
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
          setIsGenerated={setIsGenerated}
          isLoading={isImgLoading}
          setIsLoading={setIsImgLoading}
        />
      </div>
      <div className="w-full">
        <div className="flex flex-col items-center gap-5">
          <div className="flex w-full justify-between border-b-2 border-gray-400 pb-3">
            <h4 className="typo-heading2-medium">Preview</h4>
            <Button
              variant="solid"
              size="sm"
              onClick={() => handleDownloadImage(imageId)}
              disabled={!isGenerated}
            >
              Download
            </Button>
          </div>
          {generatedImageUrl ? (
            <div className="h-147 w-147 bg-transparent">
              <img
                src={generatedImageUrl}
                className="h-full w-full object-contain"
                alt="Generated Image"
              />
            </div>
          ) : (
            <div className="flex h-147 w-147 items-center justify-center bg-gray-200">
              {isImgLoading ? <Skeleton /> : <Placeholder />}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
