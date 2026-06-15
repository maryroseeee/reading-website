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
  currentlyReading?: boolean;
  wantToRead?: boolean;
  currentPage?: number;
};
