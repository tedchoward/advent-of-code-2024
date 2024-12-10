export function calculatePart1(input: string) {
  const diskMap = input.split('').map((n) => parseInt(n, 10));

  let end = diskMap.length - 1;
  if (end % 2 !== 0) {
    end -= 1;
  }
  let blockCnt = 0;
  let sum = 0;
  for (let i = 0; i <= end; i++) {
    let numBlocks = diskMap[i];
    if (i % 2 === 0) {
      const id = i / 2;
      while (numBlocks > 0) {
        sum += blockCnt * id;
        blockCnt += 1;
        numBlocks -= 1;
      }
    } else {
      let endBlocks = diskMap[end];
      const id = end / 2;

      if (endBlocks >= numBlocks) {
        diskMap[end] = endBlocks - numBlocks;

        while (numBlocks > 0) {
          sum += blockCnt * id;
          blockCnt += 1;
          numBlocks -= 1;
        }

        if (diskMap[end] === 0) {
          end -= 2;
        }
      } else {
        diskMap[i] = numBlocks - endBlocks;

        while (endBlocks > 0) {
          sum += blockCnt * id;
          blockCnt += 1;
          numBlocks -= 1;
          endBlocks -= 1;
        }

        end -= 2;
        i -= 1;
      }
    }
  }

  return sum;
}

interface Node {
  size: number;
  type: 'file' | 'free';
  id?: number;
}

export function calculatePart2(input: string) {
  const nodes = input.split('').map((n, i) => {
    const node = {} as Node;
    node.size = parseInt(n, 10);
    if (i % 2 === 0) {
      node.type = 'file';
      node.id = i / 2;
    } else {
      node.type = 'free';
    }

    return node;
  });

  for (let i = nodes.length - 1; i >= 0; i--) {
    const node = nodes[i];
    if (node.type === 'free') {
      continue;
    }

    const size = node.size;
    for (let j = 0; j < i; j++) {
      if (nodes[j].type === 'free' && nodes[j].size >= size) {
        if (nodes[j].size === size) {
          const [free] = nodes.splice(j, 1, node);
          nodes[i] = free;
        } else {
          const [free] = nodes.splice(j, 1, node);
          free.size -= node.size;
          nodes.splice(i, 1, { type: 'free', size: node.size });
          nodes.splice(j + 1, 0, free);
        }
        break;
      }
    }
  }

  let blockNum = 0;
  let sum = 0;
  for (let i = 0, cnt = nodes.length; i < cnt; i++) {
    const node = nodes[i];
    for (let j = 0; j < node.size; j++) {
      sum += blockNum * (node.id ?? 0);
      blockNum += 1;
    }
  }

  return sum;
}
