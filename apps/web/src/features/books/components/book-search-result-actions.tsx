import { Button } from "@/components/ui/button";

import type { Book } from "../types/book";
import type { BookSearchResult } from "../hooks/use-book-search-page";
import CompletionDatePicker from "./completion-date-picker";
import VersionSelect from "./version-select";

type BookSearchResultActionsProps = {
  addedBook?: Book;
  result: BookSearchResult;
  onAdd: (
    book: Book,
    options: {
      completedDate?: Date;
      currentlyReading?: boolean;
      wantToRead?: boolean;
    },
  ) => void;
  onDelete: (id: string) => void;
  onUpdate: (patch: Partial<BookSearchResult>) => void;
};

export default function BookSearchResultActions({
  addedBook,
  result,
  onAdd,
  onDelete,
  onUpdate,
}: BookSearchResultActionsProps) {
  if (addedBook?._id) {
    return (
      <div className="flex gap-2">
        <Button
          type="button"
          className="bg-green-500 text-white"
          onClick={() => onDelete(addedBook._id!)}
        >
          Added
        </Button>
        <VersionSelect
          versions={result.versions}
          selected={result.selected}
          onChange={(book) => onUpdate({ selected: book })}
        />
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <div className="flex flex-col gap-2">
        <CompletionDatePicker
          date={result.completedDate}
          onChange={(date) =>
            onUpdate({
              completedDate: date,
              currentlyReading: false,
              wantToRead: false,
            })
          }
        />
        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={Boolean(result.currentlyReading)}
            onChange={(event) =>
              onUpdate({
                completedDate: undefined,
                currentlyReading: event.target.checked,
                wantToRead: false,
              })
            }
          />
          Currently reading
        </label>
        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={Boolean(result.wantToRead)}
            onChange={(event) =>
              onUpdate({
                completedDate: undefined,
                currentlyReading: false,
                wantToRead: event.target.checked,
              })
            }
          />
          Want to read
        </label>
        <Button
          type="button"
          disabled={
            !result.completedDate &&
            !result.currentlyReading &&
            !result.wantToRead
          }
          onClick={() => {
            if (
              result.completedDate ||
              result.currentlyReading ||
              result.wantToRead
            ) {
              onAdd(result.selected, {
                completedDate: result.completedDate,
                currentlyReading: result.currentlyReading,
                wantToRead: result.wantToRead,
              });
            }
          }}
          className="bg-main"
        >
          Add
        </Button>
      </div>
      <VersionSelect
        versions={result.versions}
        selected={result.selected}
        onChange={(book) => onUpdate({ selected: book })}
      />
    </div>
  );
}
