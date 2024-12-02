export function calculatePart1(input: string) {
  let first = null;
  let last = null;
  let sum = 0;

  for (const c of input) {
    if (/\d/.test(c)) {
      if (first == null) {
        first = c;
      }

      last = c;
    } else if (c === '\n') {
      const val = parseInt(`${first}${last}`);
      sum += val;
      first = null;
      last = null;
    }
  }

  return sum;
}

export function calculatePart2(input: string) {
  let first = null;
  let last = null;
  let sum = 0;

  const len = input.length;
  for (let i = 0; i < len; i++) {
    let ch = input[i];
    if (ch === 'o' && input[i + 1] === 'n' && input[i + 2] === 'e') {
      ch = '1';
    } else if (ch === 't') {
      if (input[i + 1] === 'w' && input[i + 2] === 'o') {
        ch = '2';
      } else if (
        input[i + 1] === 'h' &&
        input[i + 2] === 'r' &&
        input[i + 3] === 'e' &&
        input[i + 4] === 'e'
      ) {
        ch = '3';
      }
    } else if (ch === 'f') {
      if (
        input[i + 1] === 'o' &&
        input[i + 2] === 'u' &&
        input[i + 3] === 'r'
      ) {
        ch = '4';
      } else if (
        input[i + 1] === 'i' &&
        input[i + 2] === 'v' &&
        input[i + 3] === 'e'
      ) {
        ch = '5';
      }
    } else if (ch === 's') {
      if (input[i + 1] === 'i' && input[i + 2] === 'x') {
        ch = '6';
      } else if (
        input[i + 1] === 'e' &&
        input[i + 2] === 'v' &&
        input[i + 3] === 'e' &&
        input[i + 4] === 'n'
      ) {
        ch = '7';
      }
    } else if (
      ch === 'e' &&
      input[i + 1] === 'i' &&
      input[i + 2] === 'g' &&
      input[i + 3] === 'h' &&
      input[i + 4] === 't'
    ) {
      ch = '8';
    } else if (
      ch === 'n' &&
      input[i + 1] === 'i' &&
      input[i + 2] === 'n' &&
      input[i + 3] === 'e'
    ) {
      ch = '9';
    }
    if (/\d/.test(ch)) {
      if (first == null) {
        first = ch;
      }

      last = ch;
    } else if (ch === '\n') {
      const val = parseInt(`${first}${last}`);
      sum += val;
      first = null;
      last = null;
    }
  }

  return sum;
}
