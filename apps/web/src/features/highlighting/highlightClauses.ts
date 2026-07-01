import type { RiskSeverity, RiskyClause } from '@app/core';
import { indicesOf } from '@/shared/lib';

export interface ContractSegment {
  text: string;
  severity: RiskSeverity | null;
  reason: string | null;
}

const ORDER: RiskSeverity[] = ['high', 'medium', 'low'];

export const buildContractSegments = (
  fullText: string,
  clauses: RiskyClause[],
): ContractSegment[] => {
  const matches = clauses
    .flatMap((clause) =>
      indicesOf(fullText, clause.text.trim()).map((start) => ({
        start,
        ...clause,
      })),
    )
    .sort(
      (a, b) =>
        a.start - b.start ||
        ORDER.indexOf(a.severity) - ORDER.indexOf(b.severity),
    );

  let cursor = 0;
  const segments = matches.flatMap(({ start, text, severity, reason }) => {
    if (start < cursor) return [];
    const gap = fullText.slice(cursor, start);
    cursor = start + text.length;
    return [
      ...(gap ? [{ text: gap, severity: null, reason: null }] : []),
      { text, severity, reason },
    ];
  });

  const tail = fullText.slice(cursor);
  return tail
    ? [...segments, { text: tail, severity: null, reason: null }]
    : segments;
};

export const highlightedSeverities = (
  clauses: RiskyClause[],
): RiskSeverity[] => {
  const present = new Set(clauses.map((clause) => clause.severity));
  return ORDER.filter((severity) => present.has(severity));
};
