# Levenshtein Benchmark

A tiny benchmark comparing three TypeScript implementations of the Levenshtein distance algorithm:

- [`fastest-levenshtein`](https://github.com/ka-weihe/fastest-levenshtein)
- [`js-levenshtein`](https://github.com/gustf/js-levenshtein)
- **Custom implementation** (`@levenshtein` – see `levenshtein.ts`)

The script measures how long each library takes to compute the distance for many randomly-chosen sentence pairs. Results are averaged across multiple runs so you can easily see which library is faster on your machine.

## Requirements

- [Bun](https://bun.sh/) (the project uses Bun for dependency management and execution)
- Node.js is **not** required.

## Usage

```bash
# Install dependencies
bun install

# Run the benchmark with the default sample dataset
bun run bench

# Or provide your own JSON file containing an array of string pairs
bun run bench path/to/your-sample.json
```

### Running tests

```bash
# Execute the test suite (compares @levenshtein against fastest-levenshtein)
bun test
```

### Dataset format

The benchmark expects a JSON file shaped like this:

```json
[
  ["string a", "string b"],
  ["another string", "another other string"],
  ...
]
```

## How it works

1. Loads each string pair from the JSON file.
2. Shows the percentage character difference for every pair so you know the data variety.
3. Repeats the following **5 runs** (configurable):
   - Calls each Levenshtein function **10 000 times** per run (configurable).
   - Records how long each run took in milliseconds.
4. Prints the run-by-run timings and the average for each library, highlighting the faster one.

## Results

```bash
Sentence pair percentage differences (run N corresponds to pair N):
run 1: 72.22% (234)
run 2: 73.95% (230)
run 3: 77.96% (283)
run 4: 76.79% (258)
run 5: 82.55% (246)
run 6: 78.32% (242)
run 7: 74.09% (143)
run 8: 71.29% (144)

Benchmark
fastest-levenshtein
  run 1: 1498.58 ms
  run 2: 1470.97 ms
  run 3: 1423.82 ms
  run 4: 1416.01 ms
  run 5: 1397.42 ms
  avg: 1441.36 ms
js-levenshtein
  run 1: 8961.40 ms
  run 2: 8902.54 ms
  run 3: 8918.72 ms
  run 4: 8916.83 ms
  run 5: 8926.73 ms
  avg: 8925.24 ms
custom-levenshtein
  run 1: 12052.00 ms
  run 2: 12224.51 ms
  run 3: 12150.78 ms
  run 4: 12354.10 ms
  run 5: 12260.99 ms
  avg: 12208.48 ms

fastest-levenshtein vs others:
js-levenshtein: 6.19x faster
custom-levenshtein: 8.47x faster
```
