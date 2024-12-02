import { describe, expect, test } from 'bun:test';
import { calculatePart1, calculatePart2 } from './lib';

describe('day 02', () => {
  test('part 1', () => {
    const input = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;
    const actual = calculatePart1(input);

    expect(actual).toBe(2);
  });

  test('part 2', () => {
    const input = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
1 5 3 2 1
1 5 3 4 5
1 2 3 4 9`;
    const actual = calculatePart2(input);

    expect(actual).toBe(7);
  });
});
