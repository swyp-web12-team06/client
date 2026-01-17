import Image from "next/image";
import { LookbookImage } from "@/type/lookbook";

export default function Gallery({ data }: { data: LookbookImage[] }) {

  const arr = [500, 600, 1000, 1200];
  return (
    <div className="p-4">
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {data.map((image, index) => {
          const randomIndex = Math.floor(Math.random() * arr.length);
          const randomValue = arr[randomIndex];

          return (<div key={index} className="break-inside-avoid relative group rounded-xl overflow-hidden">
            <Image
              src={""}
              alt={image.lookbook_image_id.toString()}
              width={800}
              height={randomValue}
              className="w-full bg-gray-200 h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              {image.prompt_id}
            </p>
          </div>)
        })}
      </div>
    </div>
  );
}
