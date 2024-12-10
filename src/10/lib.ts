export function calculatePart1(input: string) {
  const rows = input
    .split(/\n/)
    .map((r) => r.split('').map((c) => parseInt(c, 10)));

  const rowCnt = rows.length;
  const colCnt = rows[0].length;

  function tryPath(
    x: number,
    y: number,
    height: number,
    endPoints: Set<string>,
  ) {
    // console.log('tryPath', { x, y, height, endPoints });
    if (height === 9) {
      endPoints.add(`${x},${y}`);
      return;
    }

    const targetHeight = height + 1;

    if (x < colCnt - 1 && rows[y][x + 1] === targetHeight) {
      tryPath(x + 1, y, targetHeight, endPoints);
    }

    if (y < rowCnt - 1 && rows[y + 1][x] === targetHeight) {
      tryPath(x, y + 1, targetHeight, endPoints);
    }

    if (x > 0 && rows[y][x - 1] === targetHeight) {
      tryPath(x - 1, y, targetHeight, endPoints);
    }

    if (y > 0 && rows[y - 1][x] === targetHeight) {
      tryPath(x, y - 1, targetHeight, endPoints);
    }
  }

  let sum = 0;

  for (let y = 0; y < rowCnt; y++) {
    const row = rows[y];
    for (let x = 0; x < colCnt; x++) {
      if (row[x] === 0) {
        const endPoints = new Set<string>();
        tryPath(x, y, 0, endPoints);
        sum += endPoints.size;
        // console.log({ x, y }, endPoints);
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

  function tryPath(x: number, y: number, height: number, rating: number[]) {
    // console.log('tryPath', { x, y, height, endPoints });
    if (height === 9) {
      rating[0] += 1;
      return;
    }

    const targetHeight = height + 1;

    if (x < colCnt - 1 && rows[y][x + 1] === targetHeight) {
      tryPath(x + 1, y, targetHeight, rating);
    }

    if (y < rowCnt - 1 && rows[y + 1][x] === targetHeight) {
      tryPath(x, y + 1, targetHeight, rating);
    }

    if (x > 0 && rows[y][x - 1] === targetHeight) {
      tryPath(x - 1, y, targetHeight, rating);
    }

    if (y > 0 && rows[y - 1][x] === targetHeight) {
      tryPath(x, y - 1, targetHeight, rating);
    }
  }

  let sum = 0;

  for (let y = 0; y < rowCnt; y++) {
    const row = rows[y];
    for (let x = 0; x < colCnt; x++) {
      if (row[x] === 0) {
        const rating = [0];
        tryPath(x, y, 0, rating);
        sum += rating[0];
        // console.log({ x, y }, endPoints);
      }
    }
  }
  return sum;
}
