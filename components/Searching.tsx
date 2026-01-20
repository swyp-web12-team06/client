import Select, { SelectItemType } from "./commons/Select";
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
  onClearSearchTerm: () => void;
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
}: props) {

  const sortItems: SelectItemType[] = [
    {
      type: 'group',
      label: 'Sort by',
      items: [
        { value: 'new', label: 'Newest first' },
        { value: 'old', label: 'Oldest first' },
        { type: 'separator' },
        { value: 'popular', label: 'Most popular', disabled: true },
        { value: 'liked', label: 'Most liked', disabled: true },
        { value: 'bookmarked', label: 'Most bookmarked', disabled: true },
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
        { value: 'All', label: 'All' },
        ...categories.map((category) => ({
          value: category.name,
          label: category.name,
        })),
      ],
    },
  ];

  return (
    <div className="flex justify-between px-4">
      <div className="flex gap-[10.98px]">
        <Select
          value={sortOrder}
          onValueChange={onSortOrderChange}
          items={sortItems}
        />
        <Select
          value={selectedCategory || 'All'}
          onValueChange={(value) => onSelectCategory(value === 'All' ? null : value)}
          items={categoryItems}
        />
      </div>
      <Input
        isSearching
        value={searchTerm}
        placeholder="search by model, category and more.."
        onChange={onSearchTermChange}
        onClear={onClearSearchTerm}
        className="ml-[10.98px] max-w-202.75"
      />
    </div>
  );
}
