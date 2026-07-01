import { describe, expect, it } from 'vitest';
import { generatePath } from './path';

describe('generatePath', () => {
  it('substitutes a named param', () => {
    expect(generatePath('/contracts/:id', { id: 'abc' })).toBe(
      '/contracts/abc',
    );
  });

  it('substitutes multiple params', () => {
    expect(
      generatePath('/contracts/:id/pages/:page', { id: 'abc', page: 2 }),
    ).toBe('/contracts/abc/pages/2');
  });

  it('URL-encodes param values', () => {
    expect(generatePath('/search/:q', { q: 'a b/c' })).toBe(
      '/search/a%20b%2Fc',
    );
  });

  it('leaves templates without params untouched', () => {
    expect(generatePath('/health', {})).toBe('/health');
  });
});
