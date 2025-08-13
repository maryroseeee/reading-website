import { useEffect, useState } from "react";
import axios from "axios";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
  } from "@/components/ui/pagination";
import BookCard from "@/components/BookCard";
import type { Book } from "@/components/ShelfCard";
import { useNavigate } from "react-router-dom";
import DeleteButton from "@/components/DeleteButton";
import VersionSelect from "@/components/VersionSelect";
import CompletionDatePicker from "@/components/CompletionDatePicker";

const PAGE_SIZE = 20;

export default function Read() {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [versions, setVersions] = useState<Record<string, Book[]>>({});
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<Book[]>("http://localhost:4000/api/books", { withCredentials: true })
      .then((res) =>
        setBooks(
          res.data.sort((a, b) => {
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
  useEffect(() => {
    books.forEach((b) => {
      const query = [b.title, ...(b.authors || [])].join(" ");
      axios
        .get<Book[]>("http://localhost:4000/api/books/search", {
          params: { q: query },
        })
        .then((res) => {
          const grouped = Object.values(
            res.data.reduce((acc, book) => {
              const key = `${book.title.toLowerCase()}|${(book.authors || []).join(',').toLowerCase()}`;
              acc[key] = acc[key] || [];
              acc[key].push(book);
              return acc;
            }, {} as Record<string, Book[]>)
          );
          const key = `${b.title.toLowerCase()}|${(b.authors || []).join(',').toLowerCase()}`;
          const match =
            grouped.find((g) => {
              const k = `${g[0].title.toLowerCase()}|${(g[0].authors || []).join(',').toLowerCase()}`;
              return k === key;
            }) || [b];
          setVersions((prev) => {
            const prevList = prev[b._id!] || [];
            const unique = new Map<string, Book>();
            [...prevList, ...match, b].forEach((v) => {
              if (v.googleId) unique.set(v.googleId, v);
            });
            return { ...prev, [b._id!]: Array.from(unique.values()) };
          });
        });
    });
  }, [books]);

  const totalPages = Math.max(1, Math.ceil(books.length / PAGE_SIZE));
  const currentBooks = books.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const deleteBook = async (id: string) => {
    await axios.delete(`http://localhost:4000/api/books/${id}`, {
      withCredentials: true,
    });
    setBooks((prev) => prev.filter((b) => b._id !== id));
  };
  const changeVersion = async (id: string, book: Book) => {
    const res = await axios.put<Book>(`http://localhost:4000/api/books/${id}`, book, {
      withCredentials: true,
    });
    setBooks((prev) => prev.map((b) => (b._id === id ? res.data : b)));
  };

  const changeDate = async (id: string, date?: Date) => {
    const target = books.find((b) => b._id === id);
    if (!target) return;
    const res = await axios.put<Book>(`http://localhost:4000/api/books/${id}`,
      { ...target, completedDate: date ? date.toISOString() : undefined },
      { withCredentials: true }
    );
    setBooks((prev) => prev.map((b) => (b._id === id ? res.data : b)));
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
            <div className="flex gap-2">

              <div className="flex flex-col gap-2">
                <CompletionDatePicker
                date={book.completedDate ? new Date(book.completedDate) : undefined}
                onChange={(d) => changeDate(book._id!, d)}
              />
              <VersionSelect
                versions={versions[book._id!] || [book]}
                selected={book}
                onChange={(b) => changeVersion(book._id!, b)}
              />
            </div>
              <DeleteButton onConfirm={() => deleteBook(book._id!)} />
            </div>
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