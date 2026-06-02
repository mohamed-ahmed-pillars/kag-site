import { describe, expect, test } from 'bun:test';
import { isEgypt } from '@/lib/i18n/country';

describe('isEgypt', () => {
  test.each([
    'Egypt', 'egypt', '  Egypt  ', 'EG', 'eg', 'EGY', 'مصر', 'Égypte', 'égypte',
  ])('returns true for %s', (value) => {
    expect(isEgypt(value)).toBe(true);
  });

  test.each([
    'United Kingdom', 'Saudi Arabia', 'France', '', '  ', 'egyptian',
  ])('returns false for %s', (value) => {
    expect(isEgypt(value)).toBe(false);
  });

  test('returns false for undefined', () => {
    expect(isEgypt(undefined)).toBe(false);
  });
});
