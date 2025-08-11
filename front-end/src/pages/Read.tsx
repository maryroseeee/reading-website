import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import type { Book } from "@/components/ShelfCard";

const PAGE_SIZE = 25;

export default function Read() {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<Book[]>("http://localhost:4000/api/books", { withCredentials: true })
      .then((res) => setBooks(res.data));
  }, []);

  const totalPages = Math.max(1, Math.ceil(books.length / PAGE_SIZE));
  const currentBooks = books.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const deleteBook = async (id: string) => {
    await axios.delete(`http://localhost:4000/api/books/${id}`, {
      withCredentials: true,
    });
    setBooks((prev) => prev.filter((b) => b._id !== id));
  };

  return (
    <div className="p-4 space-y-4">
      <button onClick={() => navigate("/dashboard")} className="text-xl">
        ←
      </button>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {currentBooks.map((book) => (
          <div key={book._id} className="text-center">
            {book.thumbnail && (
              <img
                src={book.thumbnail}
                alt={book.title}
                className="mx-auto mb-2 w-24 h-36 object-cover"
              />
            )}
            <div className="text-sm font-medium line-clamp-2">{book.title}</div>
            <button
              onClick={() => deleteBook(book._id!)}
              className="mt-2 border px-2 py-1 text-xs"
            >
              Delete
            </button>
          </div>
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