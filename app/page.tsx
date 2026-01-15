"use client";

import Searching from "@/components/Searching";
import Gallery from "@/components/Gallery";
import Lookbook from "@/components/Lookbook";
import { LookbookImage } from "@/type/lookbook";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function View() {
  const [data, setData] = useState<LookbookImage[]>([]);
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "lookbook";

  useEffect(() => {
    fetch("/mock/LOOKBOOK_IMAGE_MOCK_DATA.json")
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  return view === "gallery" ? <Gallery data={data} /> : <Lookbook data={data} />;
}

  return (
    <main>
      <Searching />
      <Suspense fallback={<div>Loading...</div>}>
        <View />
      </Suspense>
    </main>
  );
}
