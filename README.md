# The Nuthlings

A website for our family: gardening, cooking, crafts, art, music, our animals, and life with type 2 diabetes, all from a small holding by the sea. It is built with [Astro](https://astro.build) and ships no client-side JavaScript framework.

## Running it

```sh
npm install
npm run dev      # local development at http://localhost:4321
npm run build    # static site in dist/
npm test         # unit tests (Vitest)
npm run test:e2e # end-to-end and accessibility tests (Playwright + axe)
npm run check    # type checking
```

## Adding something to the site

Every part of the site is a place on the holding. Stories live in `src/content/stories/<place>/` as Markdown files, and recipes live in `src/content/recipes/`. The places are `garden`, `crafts`, `studio`, `music`, `animals`, `type-2`, and `workshop`; the kitchen is the recipes folder.

A story starts with a short block of details at the top:

```md
---
title: Planning the winter beds
description: One sentence that appears on the cards.
date: 2026-10-12
author: mom
section: garden
tags: [planning]
materials: [Kale seedlings, Seaweed mulch] # optional, shown beside the writing
cover: ./winter-beds.jpg                    # optional, an image next to the file
coverAlt: Three raised beds behind a pallet windbreak
---

The writing goes here.
```

A recipe adds `serves`, `prepMinutes`, `cookMinutes`, an optional `carbsPerServing` estimate in grams, and an `ingredients` list. The method is written as a numbered list in the body.

Set `draft: true` to keep something off the live site while you work on it. Entries marked `sample: true` show a "Sample" badge; they are placeholders to replace with real posts.

The family lives in `src/data/family.yaml` and the animals in `src/data/animals.yaml`. The `author` field of a post is the key from `family.yaml`.

## Design

The look comes from the holding itself: salt-mist ground, sand surfaces, granite text, a deep-sea blue, kelp green from the vegetable beds, and sea thrift pink as the accent. Colors and spacing are CSS custom properties registered with `@property` in `src/styles/global.css`, with a separate night palette for dark mode. Responsive styles follow the Shared First approach: shared rules sit outside media queries and everything else lives in bounded ranges (`width < 40em`, `40em <= width < 64em`, `width >= 64em`).
