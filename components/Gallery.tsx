"use client";

import Image from "next/image";
import { LookbookImage } from "@/type/lookbook";
import { useEffect, useState } from "react";

export default function Gallery() {
  const [data, setData] = useState<LookbookImage[]>([]);
  useEffect(() => {
    fetch("/mock/LOOKBOOK_IMAGE_MOCK_DATA.json")
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

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
              alt={image.lookbook_image_id}
              width={800}
              height={randomValue}
              className="w-full bg-gray-200 h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>)
        })}
      </div>
    </div>
  );
}
