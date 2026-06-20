import { useNavigate, useParams } from "react-router-dom";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { PageError } from "@/components/page-state";
import { FriendShelfPageSkeleton } from "@/components/page-skeletons";
import FriendShelfBookGrid from "@/features/friends/components/friend-shelf-book-grid";
import FriendShelfControls from "@/features/friends/components/friend-shelf-controls";
import { useFriendShelfPage } from "@/features/friends/hooks/use-friend-shelf-page";

export default function FriendBooks() {
  const { username, shelf } = useParams();
  const navigate = useNavigate();
  const {
    currentBooks,
    error,
    friendName,
    friendProfilePath,
    handleMyBookAdded,
    isLoading,
    myBooks,
    page,
    searchQuery,
    setPage,
    setSearchQuery,
    setSort,
    shelfBooks,
    shelfCopy,
    shelfType,
    sort,
    totalPages,
    reload,
  } = useFriendShelfPage(username, shelf);

  if (isLoading) {
    return <FriendShelfPageSkeleton title={`${friendName}'s ${shelfCopy.title}`} />;
  }

  if (error) {
    return (
      <PageError
        title="Could not load friend shelf"
        message={error}
        onRetry={reload}
      />
    );
  }

  return (
    <div className="space-y-4 p-4">
      <button onClick={() => navigate(friendProfilePath)} className="text-xl">
        ←
      </button>
      <h1 className="text-center text-xl">
        {friendName}'s {shelfCopy.title}
      </h1>
      <FriendShelfControls
        searchQuery={searchQuery}
        shelfTitle={shelfCopy.title}
        shelfType={shelfType}
        sort={sort}
        onSearchChange={(value) => {
          setSearchQuery(value);
          setPage(1);
        }}
        onSortChange={(value) => {
          setSort(value);
          setPage(1);
        }}
      />
      {currentBooks.length === 0 ? (
        <p className="text-center text-sm opacity-90">
          {shelfBooks.length === 0
            ? shelfCopy.empty
            : "No books match these filters"}
        </p>
      ) : (
        <FriendShelfBookGrid
          books={currentBooks}
          myBooks={myBooks}
          shelfType={shelfType}
          onBookAdded={handleMyBookAdded}
        />
      )}

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
