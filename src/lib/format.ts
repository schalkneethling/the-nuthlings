const WORDS_PER_MINUTE = 220;

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

/**
 * Turns a number of minutes into a short label such as "1 hr 15 min".
 * Returns an empty string when there is no duration to show.
 */
export function formatMinutes(totalMinutes: number | undefined): string {
  if (!totalMinutes || totalMinutes <= 0) {
    return "";
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes} min`;
  }

  if (minutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${minutes} min`;
}

/**
 * Formats a date for display. Dates in frontmatter are written without a
 * time, so they are treated as UTC to avoid showing the previous day.
 */
export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}

/** A rough reading time, rounded up, never less than one minute. */
export function readingMinutes(text: string): number {
  const words = text
    .replace(/[#>*_`\-[\]()!]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  return Math.max(1, Math.ceil(words.length / WORDS_PER_MINUTE));
}
