import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const FORBIDDEN = [
  ["ni", "ssan"].join(""),
  ["qash", "qai"].join(""),
  ["nd", "g-"].join(""),
  ["cm", "cg"].join(""),
  ["c-", "app"].join(""),
  ["mar", "bl"].join(""),
  ["tra", "kker"].join(""),
  ["main", "tec"].join(""),
  ["myco", "bol"].join(""),
  ["el", "gie"].join(""),
  ["walter ", "craig"].join(""),
].map((s) => s.toLowerCase());

const SELF = "tests/anonymization.test.ts";

function trackedFiles(): string[] {
  return execSync("git ls-files", { encoding: "utf-8" })
    .split("\n")
    .filter((f) => f && f !== SELF && !f.endsWith(".png") && !f.endsWith(".jpg") && !f.endsWith(".pdf") && !f.endsWith(".ico"));
}

describe("anonymization gate", () => {
  it("no forbidden client strings in tracked text files", () => {
    const hits: string[] = [];
    for (const f of trackedFiles()) {
      const text = readFileSync(f, "utf-8").toLowerCase();
      for (const word of FORBIDDEN) {
        if (text.includes(word)) hits.push(`${f}: ${word}`);
      }
    }
    expect(hits).toEqual([]);
  });

  it("no forbidden client strings in commit messages", () => {
    const log = execSync("git log --all --format=%B", { encoding: "utf-8" }).toLowerCase();
    for (const word of FORBIDDEN) {
      expect(log.includes(word), `commit log contains "${word}"`).toBe(false);
    }
  });
});
