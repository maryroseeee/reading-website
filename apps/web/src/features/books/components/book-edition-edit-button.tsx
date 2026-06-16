import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { normalizeText } from "@/utils/text";

import { searchBooks, updateBook } from "../api/books-api";
import type { Book } from "../types/book";
import { groupBookVersions } from "../utils/group-books";
import VersionSelect from "./version-select";

type BookEditionEditButtonProps = {
  book: Book;
  onBookUpdated?: (book: Book) => void;
  compact?: boolean;
  className?: string;
};

function getSelectableBook(book: Book): Book {
  if (book.googleId) return book;

  return {
    ...book,
    googleId: `custom-${book._id ?? `${book.title}:${(book.authors || []).join(",")}`}`,
  };
}

function getEditionPayload(current: Book, edition: Book): Book {
  return {
    ...current,
    googleId: edition.googleId,
    title: edition.title,
    authors: edition.authors,
    pageCount: edition.pageCount,
    categories: edition.categories,
    thumbnail: edition.thumbnail,
  };
}

export default function BookEditionEditButton({
  book,
  onBookUpdated,
  compact = false,
  className,
}: BookEditionEditButtonProps) {
  const [open, setOpen] = useState(false);
  const [versions, setVersions] = useState<Book[]>([getSelectableBook(book)]);
  const [selected, setSelected] = useState<Book>(getSelectableBook(book));
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const clearActiveFocus = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      window.requestAnimationFrame(clearActiveFocus);
    }
  };

  useEffect(() => {
    const selectableBook = getSelectableBook(book);
    setSelected(selectableBook);
    setVersions([selectableBook]);
    setMessage("");
  }, [book]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    const selectableBook = getSelectableBook(book);
    const query = [book.title, ...(book.authors || [])].join(" ");

    setIsSearching(true);
    setMessage("");

    searchBooks(normalizeText(query))
      .then((results) => {
        if (cancelled) return;

        const groups = groupBookVersions(results);
        const selectedKey = `${normalizeText(book.title)}|${normalizeText(
          (book.authors || []).join(","),
        )}`;
        const matchingGroup = groups.find((group) => {
          const candidate = group.selected;
          const candidateKey = `${normalizeText(candidate.title)}|${normalizeText(
            (candidate.authors || []).join(","),
          )}`;
          return candidateKey === selectedKey;
        });
        const unique = new Map<string, Book>();
        [...(matchingGroup?.versions || []), selectableBook].forEach((version) => {
          const selectableVersion = getSelectableBook(version);
          unique.set(selectableVersion.googleId!, selectableVersion);
        });
        setVersions(Array.from(unique.values()));
      })
      .catch(() => {
        if (!cancelled) {
          setVersions([selectableBook]);
          setMessage("Search is unavailable. You can create your version.");
        }
      })
      .finally(() => {
        if (!cancelled) setIsSearching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [book, open]);

  const handleChangeEdition = async (edition: Book) => {
    if (!book._id) return;

    const selectableEdition = getSelectableBook(edition);
    setSelected(selectableEdition);
    setIsSaving(true);
    setMessage("");

    try {
      const updated = await updateBook(
        book._id,
        getEditionPayload(book, selectableEdition),
      );
      onBookUpdated?.(updated);
      setSelected(getSelectableBook(updated));
      setMessage("Edition updated");
      setOpen(false);
    } catch {
      setMessage("Could not update");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="sm"
          className={cn(
            compact ? "h-6 w-full px-1 text-[10px]" : "h-7 w-full px-2 text-[11px]",
            className,
          )}
          disabled={!book._id}
          onClick={(event) => event.stopPropagation()}
        >
          {compact ? "Edit" : "Edit edition"}
        </Button>
      </DialogTrigger>
      <DialogContent
        onClick={(event) => event.stopPropagation()}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          clearActiveFocus();
        }}
      >
        <DialogHeader>
          <DialogTitle>Change Edition</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <p className="font-heading leading-tight">{book.title}</p>
            <p className="text-sm opacity-80">
              by {(book.authors || [])[0] || "Unknown"}
            </p>
          </div>
          <VersionSelect
            versions={versions}
            selected={selected}
            onChange={(edition) => void handleChangeEdition(edition)}
          />
          {isSearching && <p className="text-sm opacity-80">Finding editions...</p>}
          {isSaving && <p className="text-sm opacity-80">Saving...</p>}
          {message && <p className="text-sm font-heading">{message}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
