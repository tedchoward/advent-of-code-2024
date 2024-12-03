import { describe, expect, test } from 'bun:test';
import { calculatePart1, calculatePart2 } from './lib';

describe('day 03', () => {
  test('part 1', () => {
    const input = `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`;
    const actual = calculatePart1(input);

    expect(actual).toBe(161);
  });

  test('part 2', () => {
    const input = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;
    const actual = calculatePart2(input);

    expect(actual).toBe(48);
  });
});
