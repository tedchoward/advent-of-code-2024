import { describe, expect, test } from 'bun:test';
import { calculatePart1, calculatePart2 } from './lib';

describe('day 09', () => {
  test('part 1', () => {
    const input = `2333133121414131402`;
    const actual = calculatePart1(input);

    expect(actual).toBe(1928);
  });

  test('part 2', () => {
    const input = `2333133121414131402`;
    const actual = calculatePart2(input);

    expect(actual).toBe(2858);
  });
});
