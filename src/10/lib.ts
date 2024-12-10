export function calculatePart1(input: string) {
  const rows = input
    .split(/\n/)
    .map((r) => r.split('').map((c) => parseInt(c, 10)));

  const rowCnt = rows.length;
  const colCnt = rows[0].length;
  const endPoints = new Set<string>();
  let sum = 0;

  function tryPath(x: number, y: number, height: number) {
    if (height === 9) {
      const key = `${x},${y}`;

      if (!endPoints.has(key)) {
        endPoints.add(`${x},${y}`);
        sum += 1;
      }

      return;
    }

    const targetHeight = height + 1;

    if (x < colCnt - 1 && rows[y][x + 1] === targetHeight) {
      tryPath(x + 1, y, targetHeight);
    }

    if (y < rowCnt - 1 && rows[y + 1][x] === targetHeight) {
      tryPath(x, y + 1, targetHeight);
    }

    if (x > 0 && rows[y][x - 1] === targetHeight) {
      tryPath(x - 1, y, targetHeight);
    }

    if (y > 0 && rows[y - 1][x] === targetHeight) {
      tryPath(x, y - 1, targetHeight);
    }
  }

  for (let y = 0; y < rowCnt; y++) {
    const row = rows[y];

    for (let x = 0; x < colCnt; x++) {
      if (row[x] === 0) {
        endPoints.clear();
        tryPath(x, y, 0);
      }
    }
  }

  return sum;
}

export function calculatePart2(input: string) {
  const rows = input
    .split(/\n/)
    .map((r) => r.split('').map((c) => parseInt(c, 10)));

  const rowCnt = rows.length;
  const colCnt = rows[0].length;
  let sum = 0;

  function tryPath(x: number, y: number, height: number) {
    if (height === 9) {
      sum += 1;
      return;
    }

    const targetHeight = height + 1;

    if (x < colCnt - 1 && rows[y][x + 1] === targetHeight) {
      tryPath(x + 1, y, targetHeight);
    }

    if (y < rowCnt - 1 && rows[y + 1][x] === targetHeight) {
      tryPath(x, y + 1, targetHeight);
    }

    if (x > 0 && rows[y][x - 1] === targetHeight) {
      tryPath(x - 1, y, targetHeight);
    }

    if (y > 0 && rows[y - 1][x] === targetHeight) {
      tryPath(x, y - 1, targetHeight);
    }
  }

  for (let y = 0; y < rowCnt; y++) {
    const row = rows[y];

    for (let x = 0; x < colCnt; x++) {
      if (row[x] === 0) {
        tryPath(x, y, 0);
      }
    }
  }

  return sum;
}
