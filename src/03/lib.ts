export function calculatePart1(input: string) {
  const re = /mul\(((\d+),(\d+))\)/g;
  let match = re.exec(input);
  let sum = 0;

  while (match != null) {
    const a = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);
    sum += a * b;
    match = re.exec(input);
  }

  return sum;
}

export function calculatePart2(input: string) {
  let sum = 0;
  let enabled = true;

  for (let i = 0, cnt = input.length; i < cnt; i++) {
    const c = input[i];

    if (c === 'd') {
      if (input.substring(i, i + 7) === "don't()") {
        enabled = false;
      } else if (input.substring(i, i + 4) === 'do()') {
        enabled = true;
      }
    } else if (enabled && c === 'm') {
      const sub = input.substring(i);
      const match = /mul\(((\d+),(\d+))\)/.exec(sub);
      if (match && match.index === 0) {
        const a = parseInt(match[2], 10);
        const b = parseInt(match[3], 10);
        sum += a * b;
        i += match[0].length - 1;
      }
    }
  }

  return sum;
}
