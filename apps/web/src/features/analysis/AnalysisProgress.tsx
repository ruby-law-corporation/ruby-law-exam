import { useState } from 'react';
import type { ReactElement } from 'react';
import {
  contractProgressEventSchema,
  type ContractProgressEvent,
  type ContractProgressStage,
} from '@app/core';
import { Loader2 } from 'lucide-react';
import { CONTRACT_PROGRESS_ROUTE } from './constants';
import { generatePath, useSse } from '@/shared/lib';
import { Card, CardContent, EmptyState, Progress } from '@/shared/ui';

const STAGE_META: Record<
  ContractProgressStage,
  { percent: number; label: string }
> = {
  uploading: { percent: 15, label: 'Uploading contract…' },
  extracting: { percent: 45, label: 'Extracting text…' },
  analysing: { percent: 75, label: 'Running AI analysis…' },
  done: { percent: 100, label: 'Finalising results…' },
  error: { percent: 100, label: 'Analysis failed' },
};

interface AnalysisProgressProps {
  id: string;
  onDone: () => void;
  onError: (message: string) => void;
}

export function AnalysisProgress({
  id,
  onDone,
  onError,
}: AnalysisProgressProps): ReactElement {
  const [stage, setStage] = useState<ContractProgressStage>('uploading');
  const { percent, label } = STAGE_META[stage];

  useSse<ContractProgressEvent>(generatePath(CONTRACT_PROGRESS_ROUTE, { id }), {
    onMessage: (event, close) => {
      const parsed = contractProgressEventSchema.safeParse(event);
      if (!parsed.success) return;

      setStage(parsed.data.stage);
      if (parsed.data.stage === 'error') {
        close();
        onError(parsed.data.message ?? 'Analysis failed');
      } else if (parsed.data.stage === 'done') {
        close();
        onDone();
      }
    },
    onError,
  });

  return (
    <Card>
      <CardContent>
        <EmptyState
          icon={Loader2}
          title="Analyzing your contract…"
          description={label}
          className="[&_svg]:animate-spin"
        >
          <Progress value={percent} className="mt-2 self-stretch" />
        </EmptyState>
      </CardContent>
    </Card>
  );
}
