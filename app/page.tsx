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
  const [sortOrder, setSortOrder] = useState('new');
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleSortOrderChange = (order: string) => {
    setSortOrder(order);
  };

  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredImages = useMemo(() => {
    let tempImages = [...lookbookImages];

    if (selectedCategory) {
      const category = categories.find(c => c.name === selectedCategory);
      if (category) {
        const categoryId = category.category_id;
        const promptIdsInCategory = prompts
          .filter(p => p.category_id === categoryId)
          .map(p => p.prompt_id);
        tempImages = lookbookImages.filter(image => promptIdsInCategory.includes(image.prompt_id));
      }
    }

    if (searchTerm.trim() !== '') {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const searchPromptIds = prompts
        .filter(p =>
          (p.title?.toLowerCase() || '').includes(lowercasedSearchTerm) ||
          (p.description?.toLowerCase() || '').includes(lowercasedSearchTerm) ||
          (p.master_prompt?.toLowerCase() || '').includes(lowercasedSearchTerm)
        )
        .map(p => p.prompt_id);

      tempImages = tempImages.filter(image => searchPromptIds.includes(image.prompt_id));
    }

    return tempImages;
  }, [selectedCategory, searchTerm, categories, prompts, lookbookImages]);

  const sortedAndFilteredImages = useMemo(() => {
    const priceMap = new Map(prompts.map(p => [p.prompt_id, p.price]));

    switch (sortOrder) {
      case 'new':
        return filteredImages.toSorted((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'old':
        return filteredImages.toSorted((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      case 'low':
        return filteredImages.toSorted((a, b) => (priceMap.get(a.prompt_id) || 0) - (priceMap.get(b.prompt_id) || 0));
      case 'high':
        return filteredImages.toSorted((a, b) => (priceMap.get(b.prompt_id) || 0) - (priceMap.get(a.prompt_id) || 0));
      default:
        return filteredImages;
    }
  }, [sortOrder, filteredImages, prompts]);

  return (
    <main>
      <Searching
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
        sortOrder={sortOrder}
        onSortOrderChange={handleSortOrderChange}
        searchTerm={searchTerm}
        onSearchTermChange={handleSearchTermChange}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <View data={sortedAndFilteredImages} />
      </Suspense>
    </main>
  );
}
