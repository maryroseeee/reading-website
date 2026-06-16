import { useEffect, useState } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
  } from "@/components/ui/pagination";
import BookCard from "@/features/books/components/book-card";
import type { Book } from "@/features/books/types/book";
import { useNavigate } from "react-router-dom";
import BookEditMenu from "@/features/books/components/book-edit-menu";
import BookEditionEditButton from "@/features/books/components/book-edition-edit-button";
import BookShelfChangeButton from "@/features/books/components/book-shelf-change-button";
import DeleteButton from "@/features/books/components/delete-button";
import CompletionDatePicker from "@/features/books/components/completion-date-picker";
import { deleteBook, getBooks, updateBook } from "@/features/books/api/books-api";

const PAGE_SIZE = 20;

export default function Read() {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    getBooks()
	      .then((data) =>
	        setBooks(
	          data.filter((book) => book.completedDate && !book.wantToRead).sort((a, b) => {
            const dateA = a.completedDate
              ? new Date(a.completedDate).getTime()
              : 0;
            const dateB = b.completedDate
              ? new Date(b.completedDate).getTime()
              : 0;
            return dateB - dateA;
          })
        )
      );
  }, []);
  const totalPages = Math.max(1, Math.ceil(books.length / PAGE_SIZE));
  const currentBooks = books.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDeleteBook = async (id: string) => {
    await deleteBook(id);
    setBooks((prev) => prev.filter((b) => b._id !== id));
  };
  const changeDate = async (id: string, date?: Date) => {
    const target = books.find((b) => b._id === id);
    if (!target) return;
    const updated = await updateBook(id, {
      ...target,
      completedDate: date ? date.toISOString() : undefined,
      currentlyReading: false,
      wantToRead: false,
    });
    setBooks((prev) => prev.map((b) => (b._id === id ? updated : b)));
  };

  const handleBookShelfChanged = (updated: Book) => {
    setBooks((prev) =>
      updated.completedDate && !updated.currentlyReading && !updated.wantToRead
        ? prev.map((b) => (b._id === updated._id ? updated : b))
        : prev.filter((b) => b._id !== updated._id),
    );
  };

  const handleBookUpdated = (updated: Book) => {
    setBooks((prev) =>
      updated.completedDate && !updated.currentlyReading && !updated.wantToRead
        ? prev.map((b) => (b._id === updated._id ? updated : b))
        : prev.filter((b) => b._id !== updated._id),
    );
  };


  return (
    <div className="p-4 space-y-4">
      <button onClick={() => navigate("/dashboard")} className="text-xl">
        ←
      </button>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {currentBooks.map((book) => (
          <BookCard
          key={book._id}
          book={book}
          action={
            book._id && (
              <BookEditMenu>
                <div className="space-y-1">
                  <p className="text-xs font-heading">Read date</p>
                <CompletionDatePicker
                date={book.completedDate ? new Date(book.completedDate) : undefined}
                onChange={(d) => changeDate(book._id!, d)}
              />
                </div>
              <BookShelfChangeButton
                book={book}
                onBookUpdated={handleBookShelfChanged}
              />
              <BookEditionEditButton
                book={book}
                onBookUpdated={handleBookUpdated}
              />
              <DeleteButton onConfirm={() => handleDeleteBook(book._id!)} />
              </BookEditMenu>
            )
          }
        />
        ))}
      </div>
      
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className={page === 1 ? "pointer-events-none opacity-50" : undefined}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }).map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={page === i + 1}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className={
                page === totalPages ? "pointer-events-none opacity-50" : undefined
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
