import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import BookListSearch from "./book-list-search";

function BookListSearchHarness() {
  const [value, setValue] = useState("");

  return (
    <BookListSearch
      value={value}
      onChange={setValue}
      placeholder="Search books"
    />
  );
}

describe("BookListSearch", () => {
  it("updates its controlled value through the change callback", async () => {
    const user = userEvent.setup();
    render(<BookListSearchHarness />);

    const input = screen.getByPlaceholderText("Search books");
    await user.type(input, "jane");

    expect(input).toHaveValue("jane");
  });
});
