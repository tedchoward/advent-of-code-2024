interface Point {
  x: number;
  y: number;
}

function cramerMethod(buttonA: Point, buttonB: Point, prize: Point) {
  const dW = buttonA.x * buttonB.y - buttonB.x * buttonA.y;
  const dWx = prize.x * buttonB.y - buttonB.x * prize.y;
  const dWy = buttonA.x * prize.y - prize.x * buttonA.y;

  const a = dWx / dW;
  const b = dWy / dW;

  if (a === Math.floor(a) && b === Math.floor(b)) {
    return { a, b };
  }

  return null;
}

export function calculatePart1(input: string) {
  const machines = input.split(/\n\n/).map((machine) => {
    return machine.split(/\n/).map((str) => {
      const match = /(\d+).*?(\d+)/.exec(str)!;
      return { x: parseInt(match[1], 10), y: parseInt(match[2], 10) };
    });
  });

  let sum = 0;

  for (const [buttonA, buttonB, prize] of machines) {
    const result = cramerMethod(buttonA, buttonB, prize);

    if (result != null && result.a <= 100 && result.b <= 100) {
      sum += result.a * 3 + result.b * 1;
    }
  }

  return sum;
}

export function calculatePart2(input: string) {
  const prizeOffset = 10_000_000_000_000;

  const machines = input.split(/\n\n/).map((machine) => {
    return machine.split(/\n/).map((str) => {
      const match = /(\d+).*?(\d+)/.exec(str)!;
      return { x: parseInt(match[1], 10), y: parseInt(match[2], 10) };
    });
  });

  let sum = 0;

  for (const [buttonA, buttonB, prize] of machines) {
    prize.x += prizeOffset;
    prize.y += prizeOffset;

    const result = cramerMethod(buttonA, buttonB, prize);
    if (result != null && (result.a === Infinity || result.b === Infinity)) {
      console.log(result);
    }

    if (result != null) {
      sum += result.a * 3 + result.b * 1;
    }
  }

  return sum;
}
