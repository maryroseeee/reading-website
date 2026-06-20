import { type ReactNode } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function items(count: number) {
  return Array.from({ length: count }, (_, index) => index);
}

function MainCardSkeleton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-base border-2 border-border bg-main p-6 text-main-foreground shadow-shadow",
        className,
      )}
    >
      {children}
    </div>
  );
}

function ProfileCardSkeleton() {
  return (
    <MainCardSkeleton>
      <div className="mb-4 rounded-base border-2 border-border bg-background p-3 shadow-shadow">
        <div className="flex h-52 items-center justify-center rounded-base border-2 border-border bg-background">
          <Skeleton className="h-44 w-44 rounded-full" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="mx-auto h-5 w-40" />
        <Skeleton className="mx-auto h-4 w-28" />
        <Skeleton className="mx-auto h-4 w-52" />
      </div>
      <div className="mt-4 flex justify-center gap-2">
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="mt-4 grid grid-cols-5 gap-2">
        {items(5).map((item) => (
          <Skeleton key={item} className="h-10" />
        ))}
      </div>
    </MainCardSkeleton>
  );
}

function CurrentlyReadingSkeleton() {
  return (
    <MainCardSkeleton>
      <h3 className="mb-4 text-center">Currently Reading</h3>
      <div className="rounded-base border-2 border-border bg-background p-3 text-foreground shadow-shadow">
        <div className="flex gap-3">
          <Skeleton className="h-32 w-20 flex-none rounded-sm" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-20" />
        </div>
        <Skeleton className="mt-3 h-5 w-full" />
        <Skeleton className="mt-2 h-4 w-28" />
      </div>
    </MainCardSkeleton>
  );
}

function FriendsCardSkeleton() {
  return (
    <MainCardSkeleton>
      <h3 className="mb-4 text-center">Friends</h3>
      <div className="flex gap-3 overflow-hidden px-6 py-2">
        {items(3).map((item) => (
          <div key={item} className="w-20 flex-none space-y-2">
            <Skeleton className="mx-auto h-16 w-16 rounded-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="mx-auto h-3 w-14" />
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </MainCardSkeleton>
  );
}

function ScoreChartSkeleton() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-24" />
        <h2 className="text-left text-xl">Score</h2>
      </div>
      <div className="rounded-base border-2 border-border bg-background text-foreground shadow-shadow">
        <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr_1fr] gap-2 border-b-2 border-border p-3">
          {items(5).map((item) => (
            <Skeleton key={item} className="h-4" />
          ))}
        </div>
        <div className="space-y-3 p-3">
          {items(4).map((row) => (
            <div
              key={row}
              className="grid grid-cols-[2fr_1fr_1.5fr_1fr_1fr] gap-2"
            >
              {items(5).map((cell) => (
                <Skeleton key={cell} className="h-4" />
              ))}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr_1fr] gap-2 border-t-2 border-border p-3">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <div />
          <Skeleton className="h-10" />
          <div />
        </div>
      </div>
    </div>
  );
}

function CarouselShelfSkeleton({ title }: { title: string }) {
  return (
    <div className="min-w-0">
      <h2 className="mb-2 text-left text-xl">{title}</h2>
      <div className="relative rounded-base border-2 border-border bg-main p-2 text-main-foreground shadow-shadow">
        <div className="grid grid-cols-2 gap-2 px-10 md:grid-cols-3 xl:grid-cols-4">
          {items(4).map((item) => (
            <div
              key={item}
              className="flex h-[280px] flex-col rounded-base border-2 border-border bg-background p-2 text-foreground shadow-shadow"
            >
              <Skeleton className="h-[196px] w-full rounded-sm" />
              <div className="mt-2 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BookGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
      {items(10).map((item) => (
        <div key={item} className="flex h-full flex-col">
          <div className="flex h-[390px] flex-col overflow-hidden rounded-base border-2 border-border bg-main p-2 text-main-foreground shadow-shadow">
            <Skeleton className="min-h-[220px] w-full flex-1 rounded-sm" />
            <div className="mt-2 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-3 w-3/5" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <Skeleton className="mt-2 h-10 w-full" />
        </div>
      ))}
    </div>
  );
}

export function DashboardPageSkeleton() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 2fr)",
      }}
      className="items-start gap-8 px-6 pb-24 pt-6"
    >
      <div className="min-w-0 flex flex-col gap-4">
        <ProfileCardSkeleton />
        <CurrentlyReadingSkeleton />
        <FriendsCardSkeleton />
      </div>

      <div className="min-w-0 flex flex-col gap-4">
        <div className="flex justify-end">
          <Skeleton className="h-10 w-36" />
        </div>
        <ScoreChartSkeleton />
        <CarouselShelfSkeleton title="All Read Books" />
        <div className="flex justify-end -mt-1">
          <Skeleton className="h-10 w-40" />
        </div>
        <CarouselShelfSkeleton title="Want To Read" />
        <div className="flex justify-end -mt-1">
          <Skeleton className="h-10 w-44" />
        </div>
      </div>
    </div>
  );
}

export function ShelfPageSkeleton({ title }: { title: string }) {
  return (
    <div className="space-y-4 p-4">
      <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <Skeleton className="h-8 w-8 justify-self-start" />
        <h1 className="text-center text-xl sm:col-start-2">{title}</h1>
        <Skeleton className="h-10 w-32 justify-self-start sm:col-start-3 sm:justify-self-end" />
      </div>
      <div className="grid items-center gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <Skeleton className="h-10 w-full max-w-md justify-self-center md:col-start-2" />
        <Skeleton className="h-10 w-40 justify-self-center md:col-start-3 md:justify-self-end" />
      </div>
      <BookGridSkeleton />
    </div>
  );
}

export function FriendShelfPageSkeleton({ title }: { title: string }) {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-8" />
      <h1 className="text-center text-xl">{title}</h1>
      <div className="grid items-center gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <Skeleton className="h-10 w-full max-w-md justify-self-center md:col-start-2" />
        <Skeleton className="h-10 w-40 justify-self-center md:col-start-3 md:justify-self-end" />
      </div>
      <BookGridSkeleton />
    </div>
  );
}

export function SearchPageSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-8" />
      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}

export function FriendsPageSkeleton() {
  return (
    <div className="p-4">
      <Skeleton className="h-8 w-8" />
      <h1 className="mb-4 text-center text-xl">Friends</h1>
      <Skeleton className="mx-auto mb-4 h-10 max-w-md" />
      <ul className="space-y-4">
        {items(4).map((item) => (
          <li
            key={item}
            className="flex flex-col gap-4 rounded-base border-2 border-border bg-main p-4 text-main-foreground shadow-shadow sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <Skeleton className="h-16 w-16 flex-none rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-44" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
            <div className="grid w-full grid-cols-3 gap-2 sm:flex sm:w-auto sm:flex-none">
              <Skeleton className="h-10 min-w-0 sm:w-24" />
              <Skeleton className="h-10 min-w-0 sm:w-24" />
              <Skeleton className="h-10 min-w-0 sm:w-24" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FriendProfilePageSkeleton() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 2fr)",
      }}
      className="items-start gap-8 p-6"
    >
      <div className="min-w-0 flex flex-col gap-4">
        <Skeleton className="h-8 w-8" />
        <ProfileCardSkeleton />
        <CurrentlyReadingSkeleton />
        <FriendsCardSkeleton />
      </div>

      <div className="min-w-0 flex flex-col gap-4">
        <ScoreChartSkeleton />
        <CarouselShelfSkeleton title="All Read Books" />
        <div className="flex justify-end -mt-1">
          <Skeleton className="h-10 w-40" />
        </div>
        <CarouselShelfSkeleton title="Want To Read" />
        <div className="flex justify-end -mt-1">
          <Skeleton className="h-10 w-44" />
        </div>
      </div>
    </div>
  );
}

export function ComparePageSkeleton() {
  return (
    <div className="min-h-screen space-y-6 p-4">
      <Skeleton className="h-8 w-8" />
      {items(2).map((item) => (
        <section key={item} className="space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-6 w-48" />
          </div>
          <ScoreChartSkeleton />
        </section>
      ))}
    </div>
  );
}

export function SessionCheckSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-base border-2 border-border bg-main p-6 shadow-shadow">
        <Skeleton className="mx-auto h-16 w-16 rounded-full" />
        <Skeleton className="mx-auto mt-4 h-5 w-40" />
        <Skeleton className="mx-auto mt-2 h-4 w-56" />
      </div>
    </div>
  );
}
