export type Book = {
  _id?: string;
  googleId?: string;
  title: string;
  authors?: string[];
  pageCount?: number;
  categories?: string[];
  thumbnail?: string;
  points?: number;
  completedDate?: string;
  shelfAddedAt?: string;
  currentlyReading?: boolean;
  wantToRead?: boolean;
  currentPage?: number;
  createdAt?: string;
  updatedAt?: string;
};
