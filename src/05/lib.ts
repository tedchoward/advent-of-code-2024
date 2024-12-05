export function calculatePart1(input: string) {
  const [ruleList, updateList] = input.split(/\n\n/);
  const rules = ruleList.split(/\n/).reduce(
    (rules, current) => {
      const [first, second] = current.split(/\|/).map((n) => parseInt(n, 10));

      if (rules[first] === undefined) {
        rules[first] = [];
      }

      rules[first].push(second);

      return rules;
    },
    {} as { [key: number]: number[] },
  );

  return updateList
    .split(/\n/)
    .filter((x) => x)
    .map((u) => u.split(',').map((n) => parseInt(n, 10)))
    .filter((update) => {
      const before = new Set();
      for (const page of update) {
        const rule = rules[page];
        if (rule != null) {
          for (const p of rule) {
            if (before.has(p)) {
              return false;
            }
          }
        }
        before.add(page);
      }
      return true;
    })
    .map((update) => update[Math.round((update.length - 1) / 2)])
    .reduce((sum, current) => sum + current, 0);
}

export function calculatePart2(input: string) {
  const [ruleList, updateList] = input.split(/\n\n/);
  const rules = ruleList.split(/\n/).reduce(
    (rules, current) => {
      const [first, second] = current.split(/\|/).map((n) => parseInt(n, 10));

      if (rules[first] === undefined) {
        rules[first] = [];
      }

      rules[first].push(second);

      return rules;
    },
    {} as { [key: number]: number[] },
  );

  return updateList
    .split(/\n/)
    .filter((x) => x)
    .map((u) => u.split(',').map((n) => parseInt(n, 10)))
    .map((update) => {
      let modified = false;
      const before = new Set();
      for (let i = 0, cnt = update.length; i < cnt; i++) {
        const page = update[i];
        const rule = rules[page];
        if (rule != null) {
          for (const p of rule) {
            if (before.has(p)) {
              // remove item at current index
              update.splice(i, 1);
              // insert item before index of p
              update.splice(update.indexOf(p), 0, page);
              // reset i to be the new index of current item
              i = update.indexOf(page);
              // reset the before Set
              before.clear();
              update.slice(0, i).forEach((item) => before.add(item));
              modified = true;
            }
          }
        }

        before.add(page);
      }

      return modified ? update : null;
    })
    .filter((x) => x != null)
    .map((update) => update[Math.round((update.length - 1) / 2)])
    .reduce((sum, current) => sum + current, 0);
}
