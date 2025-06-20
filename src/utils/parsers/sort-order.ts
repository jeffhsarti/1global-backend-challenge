export function parseSortOrder(val: unknown): 'ASC' | 'DESC' | undefined {
  if (!val) return;
  const s = String(val).toLowerCase();
  if (s === 'asc') return 'ASC';
  if (s === 'desc') return 'DESC';
  return; // just to satisfy TypeScript compiler
}
