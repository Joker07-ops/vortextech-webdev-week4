import { describe, it, expect } from "vitest";

// Simple smoke tests for components
describe("App components", () => {
  it("PokemonCard exports exist", async () => {
    const mod = await import("@/components/PokemonCard");
    expect(mod.default).toBeDefined();
  });

  it("Loader exports exist", async () => {
    const mod = await import("@/components/Loader");
    expect(mod.default).toBeDefined();
  });

  it("ErrorMessage exports exist", async () => {
    const mod = await import("@/components/ErrorMessage");
    expect(mod.default).toBeDefined();
  });

  it("NotFound exports exist", async () => {
    const mod = await import("@/components/NotFound");
    expect(mod.default).toBeDefined();
  });

  it("ErrorBoundary exports exist", async () => {
    const mod = await import("@/components/ErrorBoundary");
    expect(mod.default).toBeDefined();
  });
});
