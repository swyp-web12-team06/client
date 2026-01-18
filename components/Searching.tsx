import { Select, TextField } from "@radix-ui/themes";
import Image from "next/image";
import { Category } from "@/type/category";
import Input from "./Input";

interface props {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  sortOrder: string;
  onSortOrderChange: (sortOrder: string) => void;
  searchTerm: string;
  onSearchTermChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Searching({
  categories,
  selectedCategory,
  onSelectCategory,
  sortOrder,
  onSortOrderChange,
  searchTerm,
  onSearchTermChange,
}: props) {
  return (
    <div className="flex px-4 justify-between">
      <div className="flex gap-[10.98px]!">
        <Select.Root value={sortOrder} onValueChange={onSortOrderChange}>
          <Select.Trigger className="text-gray-500! min-h-10.5! min-w-43.25! px-[16.5px]! cursor-pointer!" radius="full" />
          <Select.Content className="rounded-2xl! p-1! mt-2! bg-(--color-bg-content-2)!" position="popper">
            <Select.Group>
              <Select.Item value="new">Newest first</Select.Item>
              <Select.Item value="old">Oldest first</Select.Item>
              <Select.Separator />
              <Select.Item value="popular" disabled>Most popular</Select.Item>
              <Select.Item value="liked" disabled>Most liked</Select.Item>
              <Select.Item value="bookmarked" disabled>Most bookmarked</Select.Item>
            </Select.Group>
            <Select.Separator />
            <Select.Group>
              <Select.Item value="low">Lowest price first</Select.Item>
              <Select.Item value="high">Highest price first</Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>
        <Select.Root
          value={selectedCategory || "All"}
          onValueChange={(value) => onSelectCategory(value === "All" ? null : value)}
        >
          <Select.Trigger className="text-gray-500! min-h-10.5! min-w-43.25! px-[16.5px]! cursor-pointer!" radius="full" />
          <Select.Content className="rounded-2xl! p-1! mt-2! bg-(--color-bg-content-2)!" position="popper">
            <Select.Group>
              <Select.Item value="All">All</Select.Item>
              {categories.map((category) => (
                <Select.Item key={category.category_id} value={category.name}>
                  {category.name}
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>
      <Input
        isSearching
        value={searchTerm}
        placeholder="search by model, category and more.."
        onChange={onSearchTermChange}
        className="max-w-202.75 ml-[10.98px]"
      />
    </div>
  );
}
