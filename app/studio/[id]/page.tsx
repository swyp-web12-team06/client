'use client';

import Image from 'next/image';
import Settings from '../_components/Settings';
import GeneratedImage from '../_components/GeneratedImage';
import { getProductForPurchase } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { ProductForPurchase } from '@/type/product';
import { useParams } from 'next/navigation';

export default function Studio() {
  const params = useParams<{ id: string }>();
  const { accessToken, isLoading, isLoggedIn, login } = useAuth();
  const [data, setData] = useState<ProductForPurchase | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    const fetchData = async () => {
      const result = await getProductForPurchase(params.id, accessToken);
      setData(result);
    };

    fetchData();
  }, [accessToken, params.id]);

  if (!data) return null;

  return (
    <main className="mt-46 flex w-[1232px] gap-6 bg-blue-300">
      <div className="align-end flex w-full flex-col gap-6">
        <div className="flex w-full justify-center gap-5">
          <div className="flex w-full flex-col">
            <h4 className="typo-body1-semibold">{data.title}</h4>
            <p className="typo-body2-regular line-clamp-7">{data.description}</p>
          </div>

          <div className="relative h-[174px] w-[240px] shrink-0 overflow-hidden bg-gray-400">
            <Image
              src={data.previewImageUrl}
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
        />
      </div>
      <div className="w-full">
        <GeneratedImage />
      </div>
    </main>
  );
}
