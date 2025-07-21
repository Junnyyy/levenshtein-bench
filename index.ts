import { distance as fastestDistance } from "fastest-levenshtein";
import levenshtein from "js-levenshtein";

type Color = "reset" | "bold" | "dim" | "red" | "green" | "cyan";
const C: Record<Color, string> = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
};

const colour = (text: string, ...codes: Color[]): string =>
  `${codes.map((c) => C[c]).join("")}${text}${C.reset}`;

const SAMPLE_FILE = Bun.argv[2] ?? "sample.json";
const ITERATIONS = 10000;
const RUNS = 5;

const loadPairs = async (path: string) => {
  const data = (await Bun.file(path).json()) as [string, string][];
  return data.map(([a, b]) => [a, b] as const);
};

type StringPair = Awaited<ReturnType<typeof loadPairs>>[number];

const percentDifference = ([a, b]: StringPair, dist: number): number =>
  (dist / Math.max(a.length, b.length)) * 100;

const pairs = await loadPairs(SAMPLE_FILE);

console.log(
  colour(
    "Sentence pair percentage differences (run N corresponds to pair N):",
    "cyan"
  )
);

pairs.forEach((pair, idx) => {
  const dist = fastestDistance(pair[0], pair[1]);
  const pct = percentDifference(pair, dist);
  console.log(colour(`run ${idx + 1}: ${pct.toFixed(2)}% (${dist})`, "dim"));
});

const measure = (fn: () => void): number => {
  const start = performance.now();
  fn();
  return performance.now() - start;
};

const runBenchmark = (name: string, fn: () => void): number[] =>
  Array.from({ length: RUNS }, () =>
    measure(() => {
      for (let i = 0; i < ITERATIONS; i++) fn();
    })
  );

const fastestTimes = runBenchmark("fastest-levenshtein", () => {
  for (const [a, b] of pairs) fastestDistance(a, b);
});

const jsTimes = runBenchmark("js-levenshtein", () => {
  for (const [a, b] of pairs) levenshtein(a, b);
});

const average = (values: number[]): number =>
  values.reduce((sum, v) => sum + v, 0) / values.length;

const format = (name: string, times: number[], faster: boolean): string => {
  const avg = average(times);
  const runs = times
    .map((t, i) => colour(`  run ${i + 1}: ${t.toFixed(2)} ms`, "dim"))
    .join("\n");
  const nameStyled = colour(name, "bold");
  const avgColored = colour(
    `  avg: ${avg.toFixed(2)} ms`,
    faster ? "green" : "red"
  );
  return `${nameStyled}\n${runs}\n${avgColored}`;
};

const avgFast = average(fastestTimes);
const avgJs = average(jsTimes);

console.log("\n" + colour("Benchmark", "bold"));
console.log(format("fastest-levenshtein", fastestTimes, avgFast < avgJs));
console.log(format("js-levenshtein", jsTimes, avgJs < avgFast));

const speedRatio = avgJs / avgFast;
const ratioStr = colour(
  `${speedRatio.toFixed(2)}x`,
  speedRatio > 1 ? "green" : "red",
  "bold"
);
console.log(
  colour("\nfastest-levenshtein is ", "bold") +
    ratioStr +
    (speedRatio > 1 ? " faster" : " slower")
);
