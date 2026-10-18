import { describe, expect, it } from "vitest";
import { newestFirst } from "../../src/lib/entries";

describe("newestFirst", () => {
  it("sorts entries by date with the most recent first", () => {
    const entries = [
      { id: "a", data: { date: new Date("2026-01-01") } },
      { id: "b", data: { date: new Date("2026-03-01") } },
      { id: "c", data: { date: new Date("2026-02-01") } },
    ];

    expect(newestFirst(entries).map((entry) => entry.id)).toEqual(["b", "c", "a"]);
  });

  it("does not mutate the original array", () => {
    const entries = [
      { id: "a", data: { date: new Date("2026-01-01") } },
      { id: "b", data: { date: new Date("2026-03-01") } },
    ];

    newestFirst(entries);
    expect(entries.map((entry) => entry.id)).toEqual(["a", "b"]);
  });
});
