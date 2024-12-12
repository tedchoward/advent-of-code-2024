import { describe, expect, test } from 'bun:test';
import { calculatePart1, calculatePart2 } from './lib';

describe('day 11', () => {
  test('part 1', () => {
    const input = `125 17`;
    const actual = calculatePart1(input);

    expect(actual).toBe(55312);
  });

  test('part 2', () => {
    const input = `125 17`;
    const actual = calculatePart2(input);

    expect(actual).toBe(55312);
  });
});
