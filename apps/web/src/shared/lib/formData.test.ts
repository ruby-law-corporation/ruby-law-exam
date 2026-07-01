import { describe, expect, it } from 'vitest';
import { toFormData } from './formData';

describe('toFormData', () => {
  it('appends string fields', () => {
    const formData = toFormData({ name: 'contract', type: 'nda' });
    expect(formData.get('name')).toBe('contract');
    expect(formData.get('type')).toBe('nda');
  });

  it('appends Blob fields', () => {
    const blob = new Blob(['x'], { type: 'application/pdf' });
    const formData = toFormData({ file: blob });
    expect(formData.get('file')).toBeInstanceOf(Blob);
  });

  it('returns an empty FormData for no fields', () => {
    const formData = toFormData({});
    expect([...formData.keys()]).toEqual([]);
  });
});
