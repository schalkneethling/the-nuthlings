import { defineCollection, reference } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";
import { sectionSlugs } from "./lib/sections";

/** The people who write on the site. Edit src/data/family.yaml to change names. */
const family = defineCollection({
  loader: file("src/data/family.yaml"),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string(),
  }),
});

/** The dogs and cats. Edit src/data/animals.yaml to change them. */
const animals = defineCollection({
  loader: file("src/data/animals.yaml"),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      kind: z.enum(["dog", "cat"]),
      description: z.string(),
      photo: image().optional(),
      photoAlt: z.string().optional(),
    }),
});

/** Everything except recipes: garden diaries, crafts, art, music, and so on. */
const stories = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/stories" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      author: reference("family"),
      section: z.enum(sectionSlugs).exclude(["kitchen"]),
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      /** Yarn, hooks, paint, seeds: whatever went into making the thing. */
      materials: z.array(z.string()).default([]),
      /** Sample entries show a badge so they are easy to find and replace. */
      sample: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

const recipes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/recipes" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      author: reference("family"),
      serves: z.number().int().positive(),
      prepMinutes: z.number().int().nonnegative().default(0),
      cookMinutes: z.number().int().nonnegative().default(0),
      /** An estimate in grams, helpful for anyone counting carbohydrates. */
      carbsPerServing: z.number().nonnegative().optional(),
      ingredients: z.array(z.string()).min(1),
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      sample: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

export const collections = { family, animals, stories, recipes };
