interface Region {
  type: string;
  points: Set<string>;
  area: number;
  perimeter: number;

  addToRegion: (x: number, y: number) => void;
  mergeRegions?: (region: Region) => void;
}

export function calculatePart1(input: string) {
  const rows: (string | Region)[][] = input.split(/\n/).map((r) => r.split(''));

  const regionPrototype = {
    addToRegion(this: Region, x: number, y: number) {
      this.points.add(`${x},${y}`);
      this.area += 1;

      let sharedEdges = 0;
      if (this.points.has(`${x - 1},${y}`)) {
        sharedEdges += 1;
      }
      if (this.points.has(`${x},${y - 1}`)) {
        sharedEdges += 1;
      }

      this.perimeter += 4 - 2 * sharedEdges;

      rows[y][x] = this;
    },
  };

  for (let y = 0, rowCnt = rows.length; y < rowCnt; y++) {
    const row = rows[y];

    for (let x = 0, colCnt = row.length; x < colCnt; x++) {
      const plot = row[x];
      if (typeof plot === 'string') {
        const left = row[x - 1];
        const top = rows[y - 1]?.[x];
        if (left && typeof left !== 'string' && left.type === plot) {
          left.addToRegion(x, y);

          if (
            top &&
            typeof top !== 'string' &&
            top.type === plot &&
            !top.points.has(`${x},${y}`)
          ) {
            for (const p of left.points) {
              const [x, y] = p.split(',').map((c) => parseInt(c, 10));
              top.addToRegion(x, y);
            }
          }
        } else if (top && typeof top !== 'string' && top.type === plot) {
          top.addToRegion(x, y);
        } else {
          rows[y][x] = Object.assign(Object.create(regionPrototype), {
            type: plot,
            points: new Set([`${x},${y}`]),
            area: 1,
            perimeter: 4,
          });
        }
      }
    }
  }

  const regions = new Set(rows.flatMap((x) => x as Region[]));

  let sum = 0;
  for (const region of regions) {
    sum += region.area * region.perimeter;
  }

  return sum;
}

export function calculatePart2(input: string) {
  const rows: (string | Region)[][] = input.split(/\n/).map((r) => r.split(''));

  const regionPrototype = {
    mergeRegions(this: Region, region: Region) {
      this.area += region.area;
      this.perimeter += region.perimeter;

      for (const p of region.points) {
        const [x, y] = p.split(',').map((c) => parseInt(c, 10));
        rows[y][x] = this;
      }

      this.points = region.points.union(this.points);
    },

    addToRegion(this: Region, x: number, y: number) {
      this.points.add(`${x},${y}`);
      this.area += 1;

      const left = this.points.has(`${x - 1},${y}`);
      const top = this.points.has(`${x},${y - 1}`);
      const topLeft = this.points.has(`${x - 1},${y - 1}`);
      const topRight = this.points.has(`${x + 1},${y - 1}`);

      if (!left && !top) {
        this.perimeter += 4;
      }

      if (!left && top && !topLeft && !topRight) {
        // region.perimeter += 0;
      }

      if (!left && top && !topLeft && topRight) {
        this.perimeter += 2;
      }

      if (!left && top && topLeft && !topRight) {
        this.perimeter += 2;
      }

      if (!left && top && topLeft && topRight) {
        this.perimeter += 4;
      }

      if (left && !top && !topLeft) {
        // region.perimeter += 0;
      }

      if (left && !top && topLeft) {
        this.perimeter += 2;
      }

      if (left && top && !topLeft && !topRight) {
        // This should only happen after merging two regions
        this.perimeter -= 2;
      }

      if (left && top && !topLeft && topRight) {
        // This should only happen after merging two regions
        // region.perimeter += 0;
      }

      if (left && top && topLeft && !topRight) {
        this.perimeter -= 2;
      }

      if (left && top && topLeft && topRight) {
        // region.perimeter += 0;
      }

      rows[y][x] = this;
    },
  };

  for (let y = 0, rowCnt = rows.length; y < rowCnt; y++) {
    const row = rows[y];

    for (let x = 0, colCnt = row.length; x < colCnt; x++) {
      const plot = row[x];
      if (typeof plot === 'string') {
        const left = row[x - 1];
        const top = rows[y - 1]?.[x];
        if (left && typeof left !== 'string' && left.type === plot) {
          if (
            top &&
            typeof top !== 'string' &&
            top.type === plot &&
            top !== left
          ) {
            left.mergeRegions?.(top);
          }

          left.addToRegion(x, y);
        } else if (top && typeof top !== 'string' && top.type === plot) {
          top.addToRegion(x, y);
        } else {
          rows[y][x] = Object.assign(Object.create(regionPrototype), {
            type: plot,
            points: new Set([`${x},${y}`]),
            area: 1,
            perimeter: 4,
          });
        }
      }
    }
  }

  const regions = new Set(rows.flatMap((x) => x as Region[]));

  let sum = 0;
  for (const region of regions) {
    sum += region.area * region.perimeter;
  }

  return sum;
}
