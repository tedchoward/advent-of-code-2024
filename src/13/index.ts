import { calculatePart1, calculatePart2 } from './lib';

const input = await Bun.file(`${import.meta.dir}/input.txt`).text();

let start = performance.now();
console.log(`Part 1: ${calculatePart1(input)}`); // 41760 too high
console.log(
  `\ttook ${Math.round((performance.now() - start) * 1000) / 1000}ms`,
);

start = performance.now();
console.log(`Part 2: ${calculatePart2(input)}`);
console.log(
  `\ttook ${Math.round((performance.now() - start) * 1000) / 1000}ms`,
);
