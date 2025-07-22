export const distance = (a: string, b: string): number => {
  if (a === b) return 0;

  let s1 = a;
  let s2 = b;

  if (s1.length < s2.length) [s1, s2] = [s2, s1];

  const m = s1.length;
  const n = s2.length;

  if (n === 0) return m;

  const row = new Uint32Array(n + 1);
  for (let j = 0; j <= n; j++) row[j] = j;

  for (let i = 1; i <= m; i++) {
    let prev = i;
    let prevTopLeft = i - 1;

    for (let j = 1; j <= n; j++) {
      const cost = s1.charCodeAt(i - 1) === s2.charCodeAt(j - 1) ? 0 : 1;

      const above = row[j] as number;
      const insert = above + 1;
      const del = prev + 1;
      const subst = prevTopLeft + cost;

      prevTopLeft = above;
      const cell = Math.min(insert, del, subst);
      row[j] = cell;
      prev = cell;
    }
  }

  return row[n] as number;
};
