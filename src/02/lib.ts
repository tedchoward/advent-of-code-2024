export function calculatePart1(input: string) {
  return input
    .split(/\n/)
    .map((report) => report.split(/\s+/).map((level) => parseInt(level, 10)))
    .reduce((numSafe, currentReport) => {
      return numSafe + (isSafe(currentReport) ? 1 : 0);
    }, 0);
}

export function calculatePart2(input: string) {
  return input
    .split(/\n/)
    .map((report) => report.split(/\s+/).map((level) => parseInt(level, 10)))
    .reduce((numSafe, currentReport) => {
      if (isSafe(currentReport)) {
        return numSafe + 1;
      } else {
        for (let i = 0, cnt = currentReport.length; i < cnt; i++) {
          const report = [
            ...currentReport.slice(0, i),
            ...currentReport.slice(i + 1),
          ];

          if (isSafe(report)) {
            return numSafe + 1;
          }
        }
      }
      return numSafe;
    }, 0);
}

function isSafe(currentReport: number[]) {
  let increasing = null;
  for (let i = 1, cnt = currentReport.length; i < cnt; i++) {
    const difference = currentReport[i - 1] - currentReport[i];
    if (difference == 0 || Math.abs(difference) > 3) {
      return false;
    }

    if (increasing == null) {
      increasing = difference < 0;
    }

    // change direction
    if (increasing != difference < 0) {
      return false;
    }
  }
  return true;
}
