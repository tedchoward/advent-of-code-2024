export function calculatePart1(input: string) {
  const rows = input.split(/\n/);
  let sum = 0;

  for (let y = 0, rowCnt = rows.length; y < rowCnt; y++) {
    const row = rows[y];
    for (let x = 0, colCnt = row.length; x < colCnt; x++) {
      if (row[x] === 'X') {
        // Start of XMAS

        // L->R
        if (
          x < colCnt - 3 &&
          row[x + 1] === 'M' &&
          row[x + 2] === 'A' &&
          row[x + 3] === 'S'
        ) {
          sum += 1;
        }
        // R->L
        if (
          x >= 3 &&
          row[x - 1] === 'M' &&
          row[x - 2] === 'A' &&
          row[x - 3] === 'S'
        ) {
          sum += 1;
        }
        // T->B
        if (
          y < rowCnt - 3 &&
          rows[y + 1][x] === 'M' &&
          rows[y + 2][x] === 'A' &&
          rows[y + 3][x] === 'S'
        ) {
          sum += 1;
        }
        // B->T
        if (
          y >= 3 &&
          rows[y - 1][x] === 'M' &&
          rows[y - 2][x] === 'A' &&
          rows[y - 3][x] === 'S'
        ) {
          sum += 1;
        }
        // TL->BR
        if (
          y < rowCnt - 3 &&
          x < colCnt - 3 &&
          rows[y + 1][x + 1] === 'M' &&
          rows[y + 2][x + 2] === 'A' &&
          rows[y + 3][x + 3] === 'S'
        ) {
          sum += 1;
        }
        // BR->TL
        if (
          y >= 3 &&
          x >= 3 &&
          rows[y - 1][x - 1] === 'M' &&
          rows[y - 2][x - 2] === 'A' &&
          rows[y - 3][x - 3] === 'S'
        ) {
          sum += 1;
        }
        // BL->TR
        if (
          y >= 3 &&
          x < colCnt - 3 &&
          rows[y - 1][x + 1] === 'M' &&
          rows[y - 2][x + 2] === 'A' &&
          rows[y - 3][x + 3] === 'S'
        ) {
          sum += 1;
        }
        // TR->BL
        if (
          y < rowCnt - 3 &&
          x >= 3 &&
          rows[y + 1][x - 1] === 'M' &&
          rows[y + 2][x - 2] === 'A' &&
          rows[y + 3][x - 3] === 'S'
        ) {
          sum += 1;
        }
      }
    }
  }

  return sum;
}

export function calculatePart2(input: string) {
  const rows = input.split(/\n/);
  let sum = 0;

  for (let y = 1, rowCnt = rows.length - 1; y < rowCnt; y++) {
    const row = rows[y];
    for (let x = 1, colCnt = row.length - 1; x < colCnt; x++) {
      if (row[x] === 'A') {
        if (
          ((rows[y - 1][x - 1] === 'M' && rows[y + 1][x + 1] === 'S') ||
            (rows[y - 1][x - 1] === 'S' && rows[y + 1][x + 1] === 'M')) &&
          ((rows[y + 1][x - 1] === 'M' && rows[y - 1][x + 1] === 'S') ||
            (rows[y + 1][x - 1] === 'S' && rows[y - 1][x + 1] === 'M'))
        ) {
          sum += 1;
        }
      }
    }
  }

  return sum;
}
