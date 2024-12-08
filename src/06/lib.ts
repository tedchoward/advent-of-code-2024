type Direction = 'up' | 'down' | 'left' | 'right';

export function calculatePart1(input: string) {
  const rows = input.split(/\n/).map((r) => r.split(''));
  const [start] = rows
    .map((row, y) => [row.indexOf('^'), y])
    .filter(([x]) => x != -1);

  let currX = start[0];
  let currY = start[1];
  let direction: Direction = 'up';

  const maxX = rows[0].length;
  const maxY = rows.length;

  while (currX >= 0 && currX < maxX && currY >= 0 && currY < maxY) {
    if (rows[currY][currX] === '#') {
      if (direction === 'up') {
        direction = 'right';
        currY += 1;
      } else if (direction === 'right') {
        direction = 'down';
        currX -= 1;
      } else if (direction === 'down') {
        direction = 'left';
        currY -= 1;
      } else if (direction === 'left') {
        direction = 'up';
        currX += 1;
      }
    } else {
      rows[currY][currX] = 'X';

      if (direction === 'up') {
        currY -= 1;
      } else if (direction === 'down') {
        currY += 1;
      } else if (direction === 'left') {
        currX -= 1;
      } else if (direction === 'right') {
        currX += 1;
      }
    }
  }

  return rows
    .map((row) => row.filter((ch) => ch === 'X').length)
    .reduce((sum, rowCount) => rowCount + sum, 0);
}

const DIR_UP = 0x01;
const DIR_LEFT = 0x02;
const DIR_RIGHT = 0x04;
const DIR_DOWN = 0x08;

export function calculatePart2(input: string) {
  const rows = input.split(/\n/).map((r) => r.split(''));
  const [start] = rows
    .map((row, y) => [row.indexOf('^'), y])
    .filter(([x]) => x != -1);

  const maxX = rows[0].length;
  const maxY = rows.length;

  let sum = 0;

  for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < maxX; x++) {
      const map = rows.map((row) => [...row]);
      if ((x === start[0] && y === start[1]) || map[y][x] === '#') {
        continue;
      }

      map[y][x] = '#';

      let currX = start[0];
      let currY = start[1];
      let direction: Direction = 'up';

      const paths = map.map((row) => row.map(() => 0));
      let loop = false;

      while (currX >= 0 && currX < maxX && currY >= 0 && currY < maxY) {
        if (map[currY][currX] === '#') {
          if (direction === 'up') {
            direction = 'right';
            currY += 1;
          } else if (direction === 'right') {
            direction = 'down';
            currX -= 1;
          } else if (direction === 'down') {
            direction = 'left';
            currY -= 1;
          } else if (direction === 'left') {
            direction = 'up';
            currX += 1;
          }
        } else {
          map[currY][currX] = 'X';

          if (direction === 'up') {
            if ((paths[currY][currX] & DIR_UP) === DIR_UP) {
              loop = true;
              break;
            }
            paths[currY][currX] |= DIR_UP;
            currY -= 1;
          } else if (direction === 'down') {
            if ((paths[currY][currX] & DIR_DOWN) === DIR_DOWN) {
              loop = true;
              break;
            }
            paths[currY][currX] |= DIR_DOWN;
            currY += 1;
          } else if (direction === 'left') {
            if ((paths[currY][currX] & DIR_LEFT) === DIR_LEFT) {
              loop = true;
              break;
            }
            paths[currY][currX] |= DIR_LEFT;
            currX -= 1;
          } else if (direction === 'right') {
            if ((paths[currY][currX] & DIR_RIGHT) === DIR_RIGHT) {
              loop = true;
              break;
            }
            paths[currY][currX] |= DIR_RIGHT;
            currX += 1;
          }
        }
      }

      if (loop) {
        sum += 1;
        loop = false;
      }
    }
  }

  return sum;
}
