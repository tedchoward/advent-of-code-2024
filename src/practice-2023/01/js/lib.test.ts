import { expect, test } from 'bun:test';
import { calculatePart1, calculatePart2 } from './lib';

test('part1', () => {
  const actual = calculatePart1(`1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet
`);

  expect(actual).toBe(142);
});

test('part 2', () => {
  const actual = calculatePart2(`two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen
`);

  expect(actual).toBe(281);
});
