import { getCollection, type CollectionEntry } from "astro:content";
import { newestFirst } from "./entries";
import { formatMinutes } from "./format";
import { getSection } from "./sections";

export type Story = CollectionEntry<"stories">;
export type Recipe = CollectionEntry<"recipes">;

/** Drafts show while running the dev server but never reach the built site. */
const isPublished = (entry: Story | Recipe) => import.meta.env.DEV || !entry.data.draft;

export async function getStories(): Promise<Story[]> {
  return newestFirst(await getCollection("stories", isPublished));
}

export async function getRecipes(): Promise<Recipe[]> {
  return newestFirst(await getCollection("recipes", isPublished));
}

/** The last part of a content id, for example "garden/winter-beds" becomes "winter-beds". */
export function entrySlug(entry: Story | Recipe): string {
  return entry.id.split("/").at(-1) ?? entry.id;
}

export function storyUrl(story: Story): string {
  return `/${story.data.section}/${entrySlug(story)}/`;
}

export function recipeUrl(recipe: Recipe): string {
  return `/kitchen/${entrySlug(recipe)}/`;
}

/** Maps family member ids to display names, for bylines. */
export async function getFamilyNames(): Promise<Map<string, string>> {
  const family = await getCollection("family");
  return new Map(family.map((member) => [member.id, member.data.name]));
}

/** Short recipe facts in the order a cook wants them. */
export function recipeDetail(recipe: Recipe): string {
  const time = formatMinutes(recipe.data.prepMinutes + recipe.data.cookMinutes);
  return [`Serves ${recipe.data.serves}`, time].filter(Boolean).join(" · ");
}

export interface CardData {
  href: string;
  title: string;
  description: string;
  date: Date;
  place: string;
  author: string;
  detail?: string;
  cover?: Story["data"]["cover"];
  coverAlt?: string;
  sample: boolean;
}

/** Turns a story or a recipe into the props an EntryCard needs. */
export function toCardData(entry: Story | Recipe, names: Map<string, string>): CardData {
  const author = names.get(entry.data.author.id) ?? entry.data.author.id;
  const shared = {
    title: entry.data.title,
    description: entry.data.description,
    date: entry.data.date,
    author,
    cover: entry.data.cover,
    coverAlt: entry.data.coverAlt,
    sample: entry.data.sample,
  };

  if (entry.collection === "recipes") {
    return { ...shared, href: recipeUrl(entry), place: getSection("kitchen").place, detail: recipeDetail(entry) };
  }

  return { ...shared, href: storyUrl(entry), place: getSection(entry.data.section).place };
}
