import { useNavigate } from "react-router-dom";

import { PageError } from "@/components/page-state";
import { BookGridSkeleton, SearchPageSkeleton } from "@/components/page-skeletons";
import { Button } from "@/components/ui/button";
import BookCard from "@/features/books/components/book-card";
import BookSearchResultActions from "@/features/books/components/book-search-result-actions";
import CustomBookDialog from "@/features/books/components/custom-book-dialog";
import { useBookSearchPage } from "@/features/books/hooks/use-book-search-page";

export default function Search() {
  const navigate = useNavigate();
  const {
    customOpen,
    error,
    getAddedBook,
    handleAddBook,
    handleDeleteBook,
    handleSearch,
    isLoading,
    isSearching,
    loadError,
    query,
    reload,
    results,
    setCustomOpen,
    setQuery,
    updateResult,
  } = useBookSearchPage();

  if (isLoading) {
    return <SearchPageSkeleton />;
  }

  if (loadError) {
    return (
      <PageError
        title="Could not load search"
        message={loadError}
        onRetry={reload}
      />
    );
  }

  return (
    <div className="p-4 space-y-4">
      <button onClick={() => navigate("/dashboard")} className="text-xl">
        ←
      </button>
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search books"
          className="border p-2 flex-1"
        />
        <Button type="submit" disabled={isSearching} className="border px-4">
          Search
        </Button>
      </form>
      {error && <p className="text-sm opacity-80">{error}</p>}
      {query && !isSearching && (
        <Button type="button" onClick={() => setCustomOpen(true)} className="bg-main">
          Add your version
        </Button>
      )}
      {isSearching ? (
        <BookGridSkeleton />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {results.map((result, index) => (
            <BookCard
              key={result.selected.googleId}
              book={result.selected}
              action={
                <BookSearchResultActions
                  result={result}
                  addedBook={getAddedBook(result.selected.googleId)}
                  onAdd={handleAddBook}
                  onDelete={handleDeleteBook}
                  onUpdate={(patch) => updateResult(index, patch)}
                />
              }
            />
          ))}
        </div>
      )}
      <CustomBookDialog
        open={customOpen}
        initialTitle={query}
        onOpenChange={setCustomOpen}
        onSave={handleAddBook}
      />
    </div>
  );
}
