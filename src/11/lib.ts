function digits(num: number) {
  return (Math.log(num) * Math.LOG10E + 1) | 0;
}

const cache = new Map<string, number>();

function blink(stone: number, count: number): number {
  const cacheKey = `${stone},${count}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  if (count === 1) {
    if (stone !== 0 && digits(stone) % 2 === 0) {
      cache.set(cacheKey, 2);
      return 2;
    }

    cache.set(cacheKey, 1);
    return 1;
  }

  if (stone === 0) {
    const sum = blink(1, count - 1);
    cache.set(cacheKey, sum);
    return sum;
  }

  const numDigits = digits(stone);
  if (numDigits % 2 === 0) {
    const splitVal = stone / Math.pow(10, numDigits / 2);
    const first = Math.floor(splitVal);
    const second = Math.round((splitVal - first) * Math.pow(10, numDigits / 2));

    const sum = blink(first, count - 1) + blink(second, count - 1);
    cache.set(cacheKey, sum);
    return sum;
  }

  const sum = blink(stone * 2024, count - 1);
  cache.set(cacheKey, sum);
  return sum;
}

export function calculatePart1(input: string) {
  cache.clear();
  const stones = input.split(/\s/).map((s) => parseInt(s, 10));

  let sum = 0;
  for (const stone of stones) {
    sum += blink(stone, 25);
  }

  return sum;
}

export function calculatePart2(input: string) {
  cache.clear();
  const stones = input.split(/\s/).map((s) => parseInt(s, 10));

  let sum = 0;
  for (const stone of stones) {
    sum += blink(stone, 75);
  }

  return sum;
}
