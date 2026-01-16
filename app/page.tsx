"use client";

import Searching from "@/components/Searching";
import Gallery from "@/components/Gallery";
import Lookbook from "@/components/Lookbook";
import { LookbookImage } from "@/type/lookbook";
import { Category } from "@/type/category";
import { Prompt } from "@/type/prompt";
import { useEffect, useState, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";

function View({ data }: { data: LookbookImage[] }) {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "lookbook";

  return view === "gallery" ? <Gallery data={data} /> : <Lookbook data={data} />;
}

export default function Home() {
  const [lookbookImages, setLookbookImages] = useState<LookbookImage[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetch("/mock/MOCK_DATA.json")
      .then((res) => res.json())
      .then((json) => {
        setLookbookImages(json.lookbook_images);
        setPrompts(json.prompts);
        setCategories(json.categories);
      });
  }, []);

  const handleCategorySelect = (categoryName: string | null) => {
    setSelectedCategory(categoryName);
  };

  const filteredImages = useMemo(() => {
    if (!selectedCategory) {
      return lookbookImages;
    }

    const category = categories.find(c => c.name === selectedCategory);
    if (!category) {
      return lookbookImages;
    }

    const categoryId = category.category_id;

    const promptIdsInCategory = prompts
      .filter(p => p.category_id === categoryId)
      .map(p => p.prompt_id);

    return lookbookImages.filter(image => promptIdsInCategory.includes(image.prompt_id));
  }, [selectedCategory, categories, prompts, lookbookImages]);

  return (
    <main>
      <Searching
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <View data={filteredImages} />
      </Suspense>
    </main>
  );
}
