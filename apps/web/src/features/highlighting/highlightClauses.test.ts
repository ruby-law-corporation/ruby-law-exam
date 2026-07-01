import { describe, expect, it } from 'vitest';
import {
  buildContractSegments,
  highlightedSeverities,
} from './highlightClauses';

describe('buildContractSegments', () => {
  it('splits text around a matched clause', () => {
    const segments = buildContractSegments(
      'The party accepts unlimited liability today.',
      [{ text: 'unlimited liability', severity: 'high', reason: 'uncapped' }],
    );
    expect(segments).toEqual([
      { text: 'The party accepts ', severity: null, reason: null },
      { text: 'unlimited liability', severity: 'high', reason: 'uncapped' },
      { text: ' today.', severity: null, reason: null },
    ]);
  });

  it('highlights every occurrence of a repeated clause', () => {
    const segments = buildContractSegments('risk and more risk', [
      { text: 'risk', severity: 'medium', reason: 'r' },
    ]);
    expect(segments.filter((s) => s.severity === 'medium')).toHaveLength(2);
  });

  it('keeps the higher severity when clauses overlap', () => {
    const segments = buildContractSegments('no liability cap', [
      { text: 'no liability', severity: 'low', reason: 'a' },
      { text: 'no liability cap', severity: 'high', reason: 'b' },
    ]);
    expect(segments).toEqual([
      { text: 'no liability cap', severity: 'high', reason: 'b' },
    ]);
  });

  it('ignores clauses that do not appear verbatim', () => {
    const segments = buildContractSegments('plain text', [
      { text: 'missing phrase', severity: 'high', reason: 'x' },
    ]);
    expect(segments).toEqual([
      { text: 'plain text', severity: null, reason: null },
    ]);
  });
});

describe('highlightedSeverities', () => {
  it('returns present severities ordered high to low', () => {
    expect(
      highlightedSeverities([
        { text: 'a', severity: 'low', reason: '' },
        { text: 'b', severity: 'high', reason: '' },
      ]),
    ).toEqual(['high', 'low']);
  });
});
