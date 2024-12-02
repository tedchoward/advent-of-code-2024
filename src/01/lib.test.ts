import { describe, expect, test } from 'bun:test';
import { calculatePart1, calculatePart2 } from './lib';

describe('day 01', () => {
  test('part 1', () => {
    const input = `3   4
4   3
2   5
1   3
3   9
3   3`;
    const actual = calculatePart1(input);

    expect(actual).toBe(11);
  });

  test('part 2', () => {
    const input = `3   4
4   3
2   5
1   3
3   9
3   3`;
    const actual = calculatePart2(input);

    expect(actual).toBe(31);
  });
});
