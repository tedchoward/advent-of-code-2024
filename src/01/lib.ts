export function calculatePart1(input: string) {
  const [first, second] = input
    .split(/\n/)
    .map((row) => row.split(/\s+/))
    .reduce(
      (prev, curr) => {
        prev[0].push(parseInt(curr[0], 10));
        prev[1].push(parseInt(curr[1], 10));
        return prev;
      },
      [[], []] as number[][],
    );

  first.sort();
  second.sort();

  let sum = 0;
  for (let i = 0, cnt = first.length; i < cnt; i++) {
    sum += Math.abs(first[i] - second[i]);
  }

  return sum;
}

export function calculatePart2(input: string) {
  const [first, second] = input
    .split(/\n/)
    .map((row) => row.split(/\s+/))
    .reduce(
      (prev, curr) => {
        prev[0].push(parseInt(curr[0], 10));
        const num = parseInt(curr[1], 10);
        if (prev[1][num] == null) {
          prev[1][num] = 0;
        }

        prev[1][num] += 1;
        return prev;
      },
      [[], {}] as [number[], { [key: number]: number }],
    );

  let sum = 0;

  for (const location of first) {
    if (location in second) {
      sum += location * second[location];
    }
  }

  return sum;
}
