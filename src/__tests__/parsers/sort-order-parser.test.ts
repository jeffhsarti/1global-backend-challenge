import { parseSortOrder } from '@utils/parsers/sort-order';

describe('parseSortOrder', () => {
  it('returns DESC for "desc" in any case', () => {
    expect(parseSortOrder('desc')).toBe('DESC');
    expect(parseSortOrder('DeSc')).toBe('DESC');
  });
  it('returns ASC for "asc" in any case', () => {
    expect(parseSortOrder('asc')).toBe('ASC');
    expect(parseSortOrder('AsC')).toBe('ASC');
  });
  it('returns undefined for invalid values', () => {
    expect(parseSortOrder('foo')).toBeUndefined();
    expect(parseSortOrder(null)).toBeUndefined();
  });
});
