import Image from "next/image";
import { LookbookImage } from "@/type/lookbook";
import { useMemo } from "react";

export default function Gallery({ data }: { data: LookbookImage[] }) {

  const randomHeights = useMemo(() => {
    const arr = [300, 350, 400, 450, 500, 550, 600];
    return data.map(() => arr[Math.floor(Math.random() * arr.length)]);
  }, [data]);

  return (
    <div className="p-4">
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {data.map((image, index) => (
          <div
            key={image.lookbook_image_id}
            className="break-inside-avoid relative group rounded-xl overflow-hidden"
            style={{ height: randomHeights[index] }}
          >
            <Image
              src={""}
              alt={String(image.lookbook_image_id)}
              fill
              className="object-cover bg-gray-200 transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <p>{image.prompt_id}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

}
