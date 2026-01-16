"use client";

import Searching from "@/components/Searching";
import Gallery from "@/components/Gallery";
import Lookbook from "@/components/Lookbook";
import { LookbookImage } from "@/type/lookbook";
import { useEffect, useState, Suspense, useRef } from "react";
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

export default function Home() {
  const [isSearchingVisible, setIsSearchingVisible] = useState(true);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      if (window.scrollY > 50) {
        setIsSearchingVisible(false);
      } else {
        setIsSearchingVisible(true);
      }

      scrollTimeout.current = setTimeout(() => {
        setIsSearchingVisible(true);
      }, 2000);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  return (
    <main className="min-h-screen pt-20">
      <div
        className={`fixed bg-(--color-bg-lightest) top-0 left-0 right-0 z-5 transition duration-300 ease-in-out ${
          isSearchingVisible ? "translate-y-0 opacity-100 pb-4" : "-translate-y-full opacity-0"
        }`}
      >
        <Searching />
      </div>
      <div className="pt-10">
        <Suspense fallback={<div>Loading...</div>}>
          <View />
        </Suspense>
      </div>
    </main>
  );
}
