import { expect, test } from "bun:test";
import { distance as customDistance } from "@levenshtein";
import { distance as fastestDistance } from "fastest-levenshtein";

const deterministicCases: [string, string][] = [
  ["", ""],
  ["", "abc"],
  ["abc", ""],
  ["abc", "abc"],
  ["kitten", "sitting"],
  ["flaw", "lawn"],
  ["gumbo", "gambol"],
  ["distance", "difference"],
  ["abcd", "dcba"],
  ["a".repeat(100), "a".repeat(99) + "b"],
];

deterministicCases.forEach(([a, b], idx) => {
  test(`deterministic case ${idx + 1}`, () => {
    expect(customDistance(a, b)).toBe(fastestDistance(a, b));
  });
});

const randomString = (length: number): string => {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  let out = "";
  for (let i = 0; i < length; i++)
    out += chars[Math.floor(Math.random() * chars.length)];
  return out;
};

test("random cases", () => {
  for (let i = 0; i < 100; i++) {
    const a = randomString(Math.floor(Math.random() * 30));
    const b = randomString(Math.floor(Math.random() * 30));
    expect(customDistance(a, b)).toBe(fastestDistance(a, b));
  }
});
