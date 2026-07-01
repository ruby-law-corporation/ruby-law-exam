import type { ReactElement } from 'react';
import type { RiskSeverity, RiskyClause } from '@app/core';
import { ChevronDown } from 'lucide-react';
import {
  buildContractSegments,
  highlightedSeverities,
} from './highlightClauses';
import { cn } from '@/shared/lib';
import { Badge } from '@/shared/ui';

interface HighlightedContractProps {
  fullText: string;
  riskyClauses: RiskyClause[];
}

const MARK_CLASSES: Record<RiskSeverity, string> = {
  high: 'bg-destructive/20 text-destructive',
  medium: 'bg-warning/20 text-warning',
  low: 'bg-success/20 text-success',
};

const SEVERITY_LABELS: Record<RiskSeverity, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export function HighlightedContract({
  fullText,
  riskyClauses,
}: HighlightedContractProps): ReactElement {
  const segments = buildContractSegments(fullText, riskyClauses);
  const legend = highlightedSeverities(riskyClauses);

  return (
    <details className="group rounded-md border border-border bg-card">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 p-4 text-sm font-medium">
        <span>Contract text with highlighted risks</span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="space-y-3 border-t border-border p-4">
        {legend.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {legend.map((severity) => (
              <Badge key={severity} variant={severity} size="sm">
                {SEVERITY_LABELS[severity]}-risk clauses
              </Badge>
            ))}
          </div>
        )}
        <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
          {segments.map((segment, index) =>
            segment.severity ? (
              <mark
                key={index}
                title={segment.reason ?? undefined}
                className={cn(
                  'rounded-sm px-0.5',
                  MARK_CLASSES[segment.severity],
                )}
              >
                {segment.text}
              </mark>
            ) : (
              <span key={index}>{segment.text}</span>
            ),
          )}
        </p>
      </div>
    </details>
  );
}
