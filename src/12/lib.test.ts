import { describe, expect, test } from 'bun:test';
import { calculatePart1, calculatePart2 } from './lib';

describe('day 12', () => {
  test('part 1', () => {
    const input = `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`;
    const actual = calculatePart1(input);

    expect(actual).toBe(1930);
  });

  test('part 2', () => {
    const input = `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`;
    const actual = calculatePart2(input);

    expect(actual).toBe(1206);
  });
});
