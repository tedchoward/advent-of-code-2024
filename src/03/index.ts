import { calculatePart1, calculatePart2 } from './lib';

const input = await Bun.file(`${import.meta.dir}/input.txt`).text();

let start = Date.now();
console.log(`Part 1: ${calculatePart1(input)}`);
console.log(`\ttook ${Date.now() - start}ms`);

start = Date.now();
console.log(`Part 2: ${calculatePart2(input)}`);
console.log(`\ttook ${Date.now() - start}ms`);
