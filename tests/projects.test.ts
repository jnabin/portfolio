import { describe, expect, it } from "vitest";
import { getAllProjects, getProjectBySlug } from "../lib/projects";

describe("projects loader", () => {
  it("loads projects sorted by order with complete frontmatter", () => {
    const all = getAllProjects();
    expect(all.length).toBeGreaterThanOrEqual(1);
    for (const p of all) {
      expect(p.slug).toMatch(/^[a-z0-9-]+$/);
      expect(p.title.length).toBeGreaterThan(5);
      expect(p.summary.length).toBeGreaterThan(20);
      expect(p.stack.length).toBeGreaterThanOrEqual(3);
      expect(p.metrics.length).toBeGreaterThanOrEqual(2);
    }
    const orders = all.map((p) => p.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it("returns null for unknown slug and content for a known one", () => {
    expect(getProjectBySlug("does-not-exist")).toBeNull();
    const first = getAllProjects()[0];
    const loaded = getProjectBySlug(first.slug);
    expect(loaded?.content).toContain("## ");
  });

  it("includes the Family Nearby and driver-app case studies", () => {
    for (const slug of ["family-nearby", "automotive-driver-app"]) {
      const loaded = getProjectBySlug(slug);
      expect(loaded, slug).not.toBeNull();
      expect(loaded?.meta.featured).toBe(true);
      expect(loaded?.content).toContain("## ");
    }
  });
});
