import { describe, expect, it } from "vitest";
import { SITE_URL, site } from "../content/site";

describe("site content integrity", () => {
  it("has the core identity fields", () => {
    expect(site.name).toBe("Jahangir Alam Nabin");
    expect(site.headline).toContain("Senior Software Engineer");
    expect(SITE_URL).toMatch(/^https:\/\//);
  });

  it("has exactly 6 experience entries in reverse-chronological order", () => {
    expect(site.experience).toHaveLength(6);
    expect(site.experience[0].company).toContain("Brain Station 23");
    expect(site.experience[5].company).toContain("Code Source");
  });

  it("has 6 skill categories and complete contact links", () => {
    expect(site.skills).toHaveLength(6);
    expect(site.contact.email).toContain("@");
    expect(site.contact.linkedin).toContain("linkedin.com");
    expect(site.contact.github).toContain("github.com");
    expect(site.contact.upwork).toContain("upwork.com");
  });

  it("evidence panel has at least 5 verified stats", () => {
    expect(site.evidence.length).toBeGreaterThanOrEqual(5);
  });
});
