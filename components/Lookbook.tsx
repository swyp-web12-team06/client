import Image from "next/image";
import { LookbookImage } from "@/type/lookbook";

export default function Lookbook({data}: {data: LookbookImage[]}) {

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
    <div className="columns-3 gap-4 space-y-4 p-4">
      {Object.entries(groupedImages).map(([promptId, images]) => (
        <div key={promptId} className="rounded-2xl overflow-hidden border border-gray-300">
          <div className="flex divide-x divide-gray-300">
            {images.map((image) => (
              <div key={image.lookbook_image_id} className="relative w-full h-52">
                <Image
                  src={""}
                  alt={`Lookbook Image ${image.lookbook_image_id}`}
                  fill
                  className="object-cover bg-gray-200"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
