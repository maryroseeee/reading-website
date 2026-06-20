import { AlertCircleIcon } from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PageError } from "@/components/page-state";
import { DashboardPageSkeleton } from "@/components/page-skeletons";
import AddBookCombobox from "@/features/books/components/add-book-combobox";
import CurrentlyReadingCard from "@/features/books/components/currently-reading-card";
import ScoreChart from "@/features/books/components/score-chart";
import ShelfCard from "@/features/books/components/shelf-card";
import DashboardProfileCard from "@/features/dashboard/components/dashboard-profile-card";
import { useDashboardPage } from "@/features/dashboard/hooks/use-dashboard-page";
import FriendsCard from "@/features/friends/components/friends-card";
import FriendRequestsCombobox from "@/features/friends/components/friend-requests-combobox";

export default function Dashboard() {
  const {
    books,
    chartYear,
    currentlyReadingBooks,
    friends,
    goToReadShelf,
    goToWantToReadShelf,
    handleBookAdded,
    handleCurrentPageChange,
    handleFriendRemoved,
    handleFriendRequestAccepted,
    handleFriendRequestRejected,
    handleLogout,
    handleProfileUpdated,
    handleRemoveCurrentlyReading,
    handleThemeColorChange,
    isLoading,
    error,
    profileOpen,
    renderBookMoveActions,
    requests,
    reload,
    setChartYear,
    setProfileOpen,
    user,
    wantToReadBooks,
    years,
  } = useDashboardPage();

  if (isLoading) {
    return <DashboardPageSkeleton />;
  }

  if (error) {
    return (
      <PageError
        title="Could not load dashboard"
        message={error}
        onRetry={reload}
      />
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 2fr)",
      }}
      className="gap-8 px-6 pt-6 pb-24 items-start"
    >
      <div className="min-w-0 flex flex-col gap-4">
        <DashboardProfileCard
          user={user}
          open={profileOpen}
          onOpenChange={setProfileOpen}
          onLogout={handleLogout}
          onProfileUpdated={handleProfileUpdated}
          onThemeColorChange={handleThemeColorChange}
        />
        <CurrentlyReadingCard
          books={currentlyReadingBooks}
          onPageChange={handleCurrentPageChange}
          onRemove={handleRemoveCurrentlyReading}
          renderBookOverlay={renderBookMoveActions}
        />
        <FriendsCard
          friends={friends}
          currentUsername={user.username}
          onFriendRemoved={handleFriendRemoved}
          friendRequestsControl={
            <FriendRequestsCombobox
              requests={requests}
              onAccept={handleFriendRequestAccepted}
              onReject={handleFriendRequestRejected}
            />
          }
        />
      </div>

      <div className="min-w-0 flex flex-col gap-4">
        {user.email && !user.username && (
          <Alert className="bg-main text-main-foreground">
            <AlertCircleIcon />
            <AlertTitle>Set your username</AlertTitle>
            <AlertDescription>
              You will not be able to make friends until you add a username.
              Click Edit Profile to add one.
            </AlertDescription>
          </Alert>
        )}
        <div className="flex justify-end">
          <AddBookCombobox books={books} onBookAdded={handleBookAdded} />
        </div>

        <ScoreChart
          books={books}
          year={chartYear}
          years={years}
          onYearChange={setChartYear}
        />
        <ShelfCard
          books={books}
          className="min-w-0"
          nextOffsetClassName="right-3"
          renderBookOverlay={renderBookMoveActions}
        />
        <div className="flex justify-end -mt-1">
          <Button
            onClick={goToReadShelf}
            className="rounded-base border-2 border-border bg-main shadow-shadow px-4 py-2 text-sm"
          >
            Go to "read books"
          </Button>
        </div>
        <ShelfCard
          books={wantToReadBooks}
          className="min-w-0"
          title="Want To Read"
          includeUndated
          nextOffsetClassName="right-3"
          renderBookOverlay={renderBookMoveActions}
        />
        <div className="flex justify-end -mt-1">
          <Button
            onClick={goToWantToReadShelf}
            className="rounded-base border-2 border-border bg-main shadow-shadow px-4 py-2 text-sm"
          >
            Go to "want to read"
          </Button>
        </div>
      </div>
    </div>
  );
}
