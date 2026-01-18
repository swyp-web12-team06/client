import Image from "next/image";
import { LookbookImage } from "@/type/lookbook";
import Link from "next/link";

export default function Lookbook({ data }: { data: LookbookImage[] }) {
  const groupedImages = data.reduce((acc, image) => {
    const promptId = image.prompt_id;
    if (!acc[promptId]) {
      acc[promptId] = [];
    }
    if (acc[promptId].length < 3) {
      acc[promptId].push(image);
    }
    return acc;
  }, {} as Record<number, LookbookImage[]>);

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {Object.entries(groupedImages).map(([promptId, images]) => (
        <Link href={`/lookbook/${promptId}`} key={promptId} className="break-inside-avoid">
          <div className="flex rounded-2xl overflow-hidden border border-gray-300 divide-x divide-gray-300">
            {images.map((image) => (
              <div key={image.lookbook_image_id} className="relative w-full h-54">
                <Image
                  src={""}
                  alt={`Lookbook Image ${image.lookbook_image_id}`}
                  fill
                  className="object-cover bg-gray-200"
                />
                <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  {image.image_url}
                </p>
              </div>
            ))}
          </div>
        </Link>
      ))}
    </div>
  );
}
