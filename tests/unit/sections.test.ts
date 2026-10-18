import { describe, expect, it } from "vitest";
import { getSection, isSectionSlug, sections, storySections } from "../../src/lib/sections";

describe("sections", () => {
  it("lists every place on the holding exactly once", () => {
    const slugs = sections.map((section) => section.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs).toEqual([
      "garden",
      "kitchen",
      "crafts",
      "studio",
      "music",
      "animals",
      "type-2",
      "workshop",
    ]);
  });

  it("gives every section a place name, a short label, and a description", () => {
    for (const section of sections) {
      expect(section.place.length).toBeGreaterThan(0);
      expect(section.label.length).toBeGreaterThan(0);
      expect(section.description.length).toBeGreaterThan(0);
    }
  });

  it("looks up a section by its slug", () => {
    expect(getSection("crafts").place).toBe("The Craft Room");
  });

  it("throws a helpful error for an unknown slug", () => {
    expect(() => getSection("attic")).toThrow(/Unknown section "attic"/);
  });

  it("recognizes valid section slugs", () => {
    expect(isSectionSlug("garden")).toBe(true);
    expect(isSectionSlug("attic")).toBe(false);
  });

  it("excludes the kitchen from story sections because recipes have their own collection", () => {
    expect(storySections.map((section) => section.slug)).not.toContain("kitchen");
    expect(storySections).toHaveLength(sections.length - 1);
  });
});
