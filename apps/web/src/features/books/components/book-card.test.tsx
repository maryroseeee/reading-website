import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import BookCard from "./book-card";

describe("BookCard", () => {
  it("renders book cover, metadata, points, and actions", () => {
    render(
      <BookCard
        book={{
          title: "Pride and Prejudice",
          authors: ["Jane Austen"],
          categories: ["Classic"],
          pageCount: 432,
          thumbnail: "https://example.com/pride.jpg",
        }}
        action={<button type="button">Edit</button>}
      />,
    );

    expect(
      screen.getByRole("img", { name: "Pride and Prejudice" }),
    ).toHaveAttribute("src", "https://example.com/pride.jpg");
    expect(screen.getByText("Pride and Prejudice")).toBeInTheDocument();
    expect(screen.getByText("by Jane Austen")).toBeInTheDocument();
    expect(screen.getByText(/432 pages/)).toBeInTheDocument();
    expect(screen.getByText("5.32 pts")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });
});
