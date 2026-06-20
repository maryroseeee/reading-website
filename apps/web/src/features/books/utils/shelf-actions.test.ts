import { describe, expect, it } from "vitest";

import { getShelfPayload, getShelfTarget } from "./shelf-actions";

describe("shelf actions", () => {
  it("detects the active shelf for a book", () => {
    expect(getShelfTarget({ title: "A", wantToRead: true })).toBe("wantToRead");
    expect(getShelfTarget({ title: "B", currentlyReading: true })).toBe(
      "currentlyReading",
    );
    expect(
      getShelfTarget({
        title: "C",
        completedDate: "2026-01-01T00:00:00.000Z",
      }),
    ).toBe("read");
  });

  it("builds a read shelf payload with completion date and reset progress", () => {
    const completedDate = new Date("2026-01-01T00:00:00.000Z");

    expect(
      getShelfPayload(
        {
          googleId: "google-1",
          title: "Jane Eyre",
          authors: ["Charlotte Bronte"],
          currentPage: 50,
        },
        "read",
        completedDate,
      ),
    ).toEqual({
      googleId: "google-1",
      title: "Jane Eyre",
      authors: ["Charlotte Bronte"],
      pageCount: undefined,
      categories: undefined,
      thumbnail: undefined,
      points: undefined,
      completedDate: completedDate.toISOString(),
      currentlyReading: false,
      wantToRead: false,
      currentPage: 0,
    });
  });
});
