export function calculatePart1(input: string) {
  return input
    .split(/\n/)
    .map((e) => e.split(': '))
    .reduce((sum, equ) => {
      const expectedResult = parseInt(equ[0], 10);
      const operands = equ[1].split(/\s/).map((o) => parseInt(o, 10));

      if (calcNext(0, operands, expectedResult)) {
        return expectedResult + sum;
      }

      return sum;
    }, 0);
}

function calcNext(result: number, operands: number[], expectedResult: number) {
  if (operands.length === 0) {
    if (result === expectedResult) {
      return true;
    }

    return false;
  }

  if (calcNext(result + operands[0], operands.slice(1), expectedResult)) {
    return true;
  }

  return calcNext(result * operands[0], operands.slice(1), expectedResult);
}

export function calculatePart2(input: string) {
  return input
    .split(/\n/)
    .map((e) => e.split(': '))
    .reduce((sum, equ) => {
      const expectedResult = parseInt(equ[0], 10);
      const operands = equ[1].split(/\s/).map((o) => parseInt(o, 10));

      if (calcNext_new(0, operands, expectedResult)) {
        return expectedResult + sum;
      }

      return sum;
    }, 0);
}

function calcNext_new(
  result: number,
  operands: number[],
  expectedResult: number,
) {
  if (operands.length === 0) {
    if (result === expectedResult) {
      return true;
    }

    return false;
  }

  if (
    calcNext_new(
      parseInt(`${result}${operands[0]}`, 10),
      operands.slice(1),
      expectedResult,
    )
  ) {
    return true;
  } else if (
    calcNext_new(result + operands[0], operands.slice(1), expectedResult)
  ) {
    return true;
  }

  return calcNext_new(result * operands[0], operands.slice(1), expectedResult);
}
