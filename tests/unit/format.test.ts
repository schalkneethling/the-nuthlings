import { describe, expect, it } from "vitest";
import { formatDate, formatMinutes, readingMinutes } from "../../src/lib/format";

describe("formatMinutes", () => {
  it("formats durations under an hour in minutes", () => {
    expect(formatMinutes(25)).toBe("25 min");
  });

  it("formats whole hours without a minute part", () => {
    expect(formatMinutes(120)).toBe("2 hr");
  });

  it("formats hours and minutes together", () => {
    expect(formatMinutes(75)).toBe("1 hr 15 min");
  });

  it("returns an empty string for zero or missing durations", () => {
    expect(formatMinutes(0)).toBe("");
    expect(formatMinutes(undefined)).toBe("");
  });
});

describe("formatDate", () => {
  it("formats a date as a long, human readable US date", () => {
    expect(formatDate(new Date("2026-10-18T00:00:00Z"))).toBe("October 18, 2026");
  });
});

describe("readingMinutes", () => {
  it("never reports less than one minute", () => {
    expect(readingMinutes("A short note.")).toBe(1);
  });

  it("estimates at roughly 220 words per minute, rounding up", () => {
    const words = Array.from({ length: 450 }, () => "word").join(" ");
    expect(readingMinutes(words)).toBe(3);
  });

  it("ignores markdown punctuation and extra whitespace", () => {
    expect(readingMinutes("## Heading\n\n- one\n- two   three")).toBe(1);
  });
});
