interface Point {
  x: number;
  y: number;
}

export function calculatePart1(input: string) {
  const rows = input.split(/\n/);

  const antennas = new Map<string, Point[]>();
  const antinodes = rows.map((r) => new Array(r.length).fill(''));

  function addAntinode(ch: string, x: number, y: number) {
    if (y >= 0 && y < rows.length) {
      const row = rows[y];
      if (x >= 0 && x < row.length && row[x] !== ch) {
        antinodes[y][x] = '#';
      }
    }
  }

  for (let y = 0, rowCnt = rows.length; y < rowCnt; y++) {
    const row = rows[y];

    for (let x = 0, colCnt = row.length; x < colCnt; x++) {
      const ch = rows[y][x];
      if (/[a-zA-Z0-9]/.test(ch)) {
        if (antennas.has(ch)) {
          const points = antennas.get(ch)!;

          for (const point of points) {
            const xOff = point.x - x;
            const yOff = point.y - y;

            addAntinode(ch, point.x + xOff, point.y + yOff);
            addAntinode(ch, x - xOff, y - yOff);
          }

          points.push({ x, y });
        } else {
          antennas.set(ch, [{ x, y }]);
        }
      }
    }
  }

  return antinodes
    .map((row) => row.filter((ch) => ch === '#').length)
    .reduce((sum, ct) => sum + ct, 0);
}

export function calculatePart2(input: string) {
  const rows = input.split(/\n/);

  const antennas = new Map<string, Point[]>();
  const antinodes = rows.map((r) => new Array(r.length).fill(''));

  for (let y = 0, rowCnt = rows.length; y < rowCnt; y++) {
    const row = rows[y];

    for (let x = 0, colCnt = row.length; x < colCnt; x++) {
      const ch = rows[y][x];
      if (/[a-zA-Z0-9]/.test(ch)) {
        if (antennas.has(ch)) {
          const points = antennas.get(ch)!;

          for (const point of points) {
            const xOff = point.x - x;
            const yOff = point.y - y;

            let currX = x;
            let currY = y;

            while (
              currX >= 0 &&
              currX < colCnt &&
              currY >= 0 &&
              currY < rowCnt
            ) {
              antinodes[currY][currX] = '#';
              currX += xOff;
              currY += yOff;
            }

            currX = x;
            currY = y;

            while (
              currX >= 0 &&
              currX < colCnt &&
              currY >= 0 &&
              currY < rowCnt
            ) {
              antinodes[currY][currX] = '#';
              currX -= xOff;
              currY -= yOff;
            }
          }

          points.push({ x, y });
        } else {
          antennas.set(ch, [{ x, y }]);
        }
      }
    }
  }

  return antinodes
    .map((row) => row.filter((ch) => ch === '#').length)
    .reduce((sum, ct) => sum + ct, 0);
}
