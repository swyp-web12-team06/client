import Select, { SelectItemType } from "./commons/Select";
import Input from "./commons/Input";
import { Category } from "@/type/category";

interface SearchingProps {
  categories: Category[];
  selectedCategory: number | null;
  onSelectCategory: (categoryId: string | null) => void;
  sortOrder: string;
  onSortOrderChange: (sortOrder: string) => void;
  searchTerm: string;
  onSearchTermChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearchTerm: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function Searching({
  categories,
  selectedCategory,
  onSelectCategory,
  sortOrder,
  onSortOrderChange,
  searchTerm,
  onSearchTermChange,
  onClearSearchTerm,
  onKeyDown,
}: SearchingProps) {

  const sortItems: SelectItemType[] = [
    {
      type: 'group',
      label: 'Sort by',
      items: [
        { value: 'new', label: 'Newest first' },
        { value: 'old', label: 'Oldest first' },
      ],
    },
    { type: 'separator' },
    {
      type: 'group',
      label: 'Price',
      items: [
        { value: 'low', label: 'Lowest price first' },
        { value: 'high', label: 'Highest price first' },
      ],
    },
  ];

  const categoryItems: SelectItemType[] = [
    {
      type: 'group',
      label: 'Category',
      items: [
        { value: 'all', label: 'All' },
        ...categories.map((category) => ({
          value: String(category.id),
          label: category.name,
        })),
      ],
    },
  ];

  return (
    <div className="flex justify-between">
      <div className="flex gap-[10.98px]">
        <Select
          value={sortOrder}
          onValueChange={onSortOrderChange}
          items={sortItems}
        />
        <Select
          value={selectedCategory ? String(selectedCategory) : 'all'}
          onValueChange={(value) => onSelectCategory(value === 'all' ? null : value)}
          items={categoryItems}
        />
      </div>
      <Input
        isSearching
        value={searchTerm}
        placeholder="search by model, category and more.."
        onChange={onSearchTermChange}
        onClear={onClearSearchTerm}
        onKeyDown={onKeyDown}
        className="ml-[10.98px] max-w-202.75"
      />
    </div>
  );
}
