import type { ReactElement } from 'react';
import { CircleAlert, FileSearch } from 'lucide-react';
import { Card, CardContent, EmptyState } from '@/shared/ui';

interface ContractUploadStatusPanelProps {
  error: string;
  hasResult: boolean;
}

export function ContractUploadStatusPanel({
  error,
  hasResult,
}: ContractUploadStatusPanelProps): ReactElement | null {
  if (error) {
    return (
      <div className="flex items-start gap-2 rounded-md border border-destructive/35 bg-destructive/10 p-4 text-sm text-destructive">
        <CircleAlert className="mt-0.5 size-4 shrink-0" />
        {error}
      </div>
    );
  }
  if (!hasResult) {
    return (
      <Card>
        <CardContent>
          <EmptyState
            icon={FileSearch}
            title="No analysis yet"
            description="Upload a contract above to see its risk score, missing clauses, and recommendations."
          />
        </CardContent>
      </Card>
    );
  }
  return null;
}
