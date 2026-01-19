import { Category } from "@/type/category";
import Input from "./commons/Input";

interface props {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  sortOrder: string;
  onSortOrderChange: (sortOrder: string) => void;
  searchTerm: string;
  onSearchTermChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

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
    <div className="flex justify-between px-4">
      <div className="flex gap-[10.98px]!">
        {/* <Select.Root value={sortOrder} onValueChange={onSortOrderChange}>
          <Select.Trigger
            className="min-h-10.5! min-w-43.25! cursor-pointer! px-[16.5px]! text-gray-500!"
            radius="full"
          />
          <Select.Content
            className="mt-2! rounded-2xl! bg-(--color-bg-content-2)! p-1!"
            position="popper"
          >
            <Select.Group>
              <Select.Item value="new">Newest first</Select.Item>
              <Select.Item value="old">Oldest first</Select.Item>
              <Select.Separator />
              <Select.Item value="popular" disabled>
                Most popular
              </Select.Item>
              <Select.Item value="liked" disabled>
                Most liked
              </Select.Item>
              <Select.Item value="bookmarked" disabled>
                Most bookmarked
              </Select.Item>
            </Select.Group>
            <Select.Separator />
            <Select.Group>
              <Select.Item value="low">Lowest price first</Select.Item>
              <Select.Item value="high">Highest price first</Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>
        <Select.Root
          value={selectedCategory || 'All'}
          onValueChange={(value) => onSelectCategory(value === 'All' ? null : value)}
        >
          <Select.Trigger
            className="min-h-10.5! min-w-43.25! cursor-pointer! px-[16.5px]! text-gray-500!"
            radius="full"
          />
          <Select.Content
            className="mt-2! rounded-2xl! bg-(--color-bg-content-2)! p-1!"
            position="popper"
          >
            <Select.Group>
              <Select.Item value="All">All</Select.Item>
              {categories.map((category) => (
                <Select.Item key={category.category_id} value={category.name}>
                  {category.name}
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Content>
        </Select.Root> */}
      </div>
      <Input
        isSearching
        value={searchTerm}
        placeholder="search by model, category and more.."
        onChange={onSearchTermChange}
        className="ml-[10.98px] max-w-202.75"
      />
    </div>
  );
}
