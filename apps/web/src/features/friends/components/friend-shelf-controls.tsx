import BookListSearch from "@/features/books/components/book-list-search";
import ShelfSortSelect from "@/features/books/components/shelf-sort-select";
import type { ShelfSort } from "@/features/books/utils/shelf-books";

import {
  getFriendShelfSortOptions,
  type FriendShelfType,
} from "../utils/friend-shelves";

type FriendShelfControlsProps = {
  searchQuery: string;
  shelfTitle: string;
  shelfType: FriendShelfType;
  sort: ShelfSort;
  onSearchChange: (value: string) => void;
  onSortChange: (value: ShelfSort) => void;
};

export default function FriendShelfControls({
  searchQuery,
  shelfTitle,
  shelfType,
  sort,
  onSearchChange,
  onSortChange,
}: FriendShelfControlsProps) {
  return (
    <div className="grid items-center gap-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
      <div className="lg:col-start-2">
        <BookListSearch
          value={searchQuery}
          onChange={onSearchChange}
          placeholder={`Search ${shelfTitle.toLowerCase()}`}
        />
      </div>
      <div className="flex flex-wrap justify-center gap-2 lg:col-start-3 lg:justify-self-end">
        <ShelfSortSelect
          value={sort}
          options={getFriendShelfSortOptions(shelfType)}
          onChange={onSortChange}
        />
      </div>
    </div>
  );
}
