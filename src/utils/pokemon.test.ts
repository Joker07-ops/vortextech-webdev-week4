import { describe, it, expect } from "vitest";
import { spriteUrl, formatHeight, formatWeight, TYPE_COLORS } from "./pokemon";

describe("spriteUrl", () => {
  it("returns a local sprite path for a given numeric ID", () => {
    const url = spriteUrl(25);
    expect(url).toBe("/sprites/25.png");
  });

  it("accepts string IDs", () => {
    const url = spriteUrl("150");
    expect(url).toBe("/sprites/150.png");
  });
});

describe("formatHeight", () => {
  it("converts decimeters to meters", () => {
    expect(formatHeight(7)).toBe("0.7 m");
  });

  it("handles zero", () => {
    expect(formatHeight(0)).toBe("0.0 m");
  });
});

describe("formatWeight", () => {
  it("converts hectograms to kilograms", () => {
    expect(formatWeight(69)).toBe("6.9 kg");
  });

  it("handles zero", () => {
    expect(formatWeight(0)).toBe("0.0 kg");
  });
});

describe("TYPE_COLORS", () => {
  it("has entries for all 18 Pokemon types", () => {
    expect(Object.keys(TYPE_COLORS)).toHaveLength(18);
  });

  it("returns a hex color for known types", () => {
    expect(TYPE_COLORS["fire"]).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });
});
