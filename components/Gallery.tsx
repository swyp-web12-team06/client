import { Product } from '@/type/product';
import Link from 'next/link';

export default function Gallery({ data }: { data: Product[] }) {

  return (
    <div className="columns-2 gap-4 space-y-4 md:columns-3 lg:columns-4">
      {data.map((product) => {
        return (
          <div
            key={product.promptId}
            className="group relative break-inside-avoid overflow-hidden rounded-xl"
          >
            <Link href={`/lookbook/${product.promptId}`} key={product.promptId} className="break-inside-avoid">
            <img
              src={product.previewImageUrl}
              alt={product.title}
              className="bg-gray-200 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gray-400 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
            <div className="absolute bottom-0 left-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="font-bold">{product.title}</p>
              <p className="text-sm">{product.seller.nickname}</p>
            </div>
            </Link>
          </div>
        )
      })}
    </div>
  );
}
