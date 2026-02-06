import Image from 'next/image';
import Settings from '../_components/Settings';
import GeneratedImage from '../_components/GeneratedImage';
import { getProductForPurchase } from '@/lib/api';

export default async function Studio({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const productForPurchase = await getProductForPurchase(resolvedParams.id);

  return (
    <main className="mt-46 flex w-[1232px] gap-6 bg-blue-300">
      <div className="align-end flex w-full flex-col gap-6">
        <div className="flex w-full justify-center gap-5">
          <div className="flex w-full flex-col">
            <h4 className="typo-body1-semibold">{productForPurchase.title}</h4>
            <p className="typo-body2-regular line-clamp-7">{productForPurchase.description}</p>
          </div>

          <div className="relative h-[174px] w-[240px] shrink-0 overflow-hidden bg-gray-400">
            <Image
              src={productForPurchase.previewImageUrl}
              alt={productForPurchase.title ?? 'product image'}
              fill
              sizes="240px"
              className="object-cover object-center"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
        <Settings
          promptId={resolvedParams.id}
          promptVariables={productForPurchase.promptVariables}
          aspectRatios={productForPurchase.modelInfo.aspectRatios}
          resolutions={productForPurchase.modelInfo.resolutions}
          modelId={productForPurchase.modelInfo.modelId}
        />
      </div>
      <div className="w-full">
        <GeneratedImage />
      </div>
    </main>
  );
}
