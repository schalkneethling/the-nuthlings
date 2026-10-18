interface Dated {
  data: { date: Date };
}

/** Returns a new array sorted with the most recent entry first. */
export function newestFirst<Entry extends Dated>(entries: readonly Entry[]): Entry[] {
  return [...entries].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
