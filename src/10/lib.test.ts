import { describe, expect, test } from 'bun:test';
import { calculatePart1, calculatePart2 } from './lib';

describe('day 10', () => {
  test('part 1', () => {
    const input = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;
    const actual = calculatePart1(input);

    expect(actual).toBe(36);
  });

  test('part 2', () => {
    const input = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;
    const actual = calculatePart2(input);

    expect(actual).toBe(81);
  });
});
