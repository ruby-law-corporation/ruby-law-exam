import { describe, expect, it } from 'vitest';
import { indicesOf } from './string';

describe('indicesOf', () => {
  it('finds every occurrence of a needle', () => {
    expect(indicesOf('risk and more risk', 'risk')).toEqual([0, 14]);
  });

  it('returns an empty array for an empty needle', () => {
    expect(indicesOf('anything', '')).toEqual([]);
  });

  it('returns an empty array when the needle is absent', () => {
    expect(indicesOf('plain text', 'missing')).toEqual([]);
  });
});
