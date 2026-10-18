/**
 * Every part of the website is a place on the holding. The slug is used in
 * URLs and in content frontmatter, the place is the name shown on the page,
 * and the label is the short name used in navigation.
 */
export interface Section {
  slug: string;
  place: string;
  label: string;
  description: string;
}

export const sections = [
  {
    slug: "garden",
    place: "The Garden",
    label: "Garden",
    description: "Beds, seedlings, harvests, and whatever the sea wind allowed to grow this season.",
  },
  {
    slug: "kitchen",
    place: "The Kitchen",
    label: "Recipes",
    description: "Recipes we cook again and again, many of them straight from the garden.",
  },
  {
    slug: "crafts",
    place: "The Craft Room",
    label: "Crafts",
    description: "Crochet, knitting, plushies, and all the small handmade things in between.",
  },
  {
    slug: "studio",
    place: "The Studio",
    label: "Art",
    description: "Drawings, paintings, and sketchbook pages from the artists in the house.",
  },
  {
    slug: "music",
    place: "The Music Shed",
    label: "Music",
    description: "Guitar practice, songs we are learning, and the occasional recording.",
  },
  {
    slug: "animals",
    place: "The Yard",
    label: "Animals",
    description: "Three dogs, three cats, and the stories they give us every single day.",
  },
  {
    slug: "type-2",
    place: "The Bench by the Sea",
    label: "Type 2",
    description: "Living with type 2 diabetes: what we have learned, what is hard, and what helps.",
  },
  {
    slug: "workshop",
    place: "The Workshop",
    label: "Workshop",
    description: "Computers, code, AI, and the odd experiment that keeps this website running.",
  },
] as const satisfies readonly Section[];

export type SectionSlug = (typeof sections)[number]["slug"];

/** Sections whose entries live in the stories collection. */
export const storySections = sections.filter((section) => section.slug !== "kitchen");

export const sectionSlugs = sections.map((section) => section.slug) as [
  SectionSlug,
  ...SectionSlug[],
];

export function isSectionSlug(value: string): value is SectionSlug {
  return sections.some((section) => section.slug === value);
}

export function getSection(slug: string): Section {
  const section = sections.find((candidate) => candidate.slug === slug);

  if (!section) {
    throw new Error(`Unknown section "${slug}". Use one of: ${sectionSlugs.join(", ")}.`);
  }

  return section;
}
