import { useState } from 'react';
import type { ReactElement } from 'react';
import type { ContractAnalysis } from '@app/core';
import { ContractUploadStatusPanel } from './ContractUploadStatusPanel';
import {
  AnalysisResults,
  AnalysisProgress,
  CONTRACT_DETAIL_ROUTE,
} from '@/features/analysis';
import { HighlightedContract } from '@/features/highlighting';
import { UploadForm } from '@/features/upload';
import { requestData } from '@/shared/api';
import { generatePath } from '@/shared/lib';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui';

export function ContractUploadPage(): ReactElement {
  const [result, setResult] = useState<ContractAnalysis | null>(null);
  const [error, setError] = useState('');
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  const handleStarted = (id: string) => {
    setResult(null);
    setError('');
    setAnalyzingId(id);
  };

  const handleError = (message: string) => {
    setError(message);
    setAnalyzingId(null);
  };

  const handleDone = async (id: string) => {
    try {
      setResult(
        await requestData<ContractAnalysis>(
          generatePath(CONTRACT_DETAIL_ROUTE, { id }),
        ),
      );
      setAnalyzingId(null);
    } catch (err) {
      handleError(err instanceof Error ? err.message : 'Analysis failed');
    }
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl">Contract Analysis</h1>
        <p className="text-sm text-muted-foreground">
          Upload a contract to detect its type, surface risk flags, and get
          plain-English recommendations.
        </p>
      </header>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload contract</CardTitle>
            <CardDescription>
              We accept PDF and DOCX files up to 10 MB.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UploadForm onStarted={handleStarted} onError={handleError} />
          </CardContent>
        </Card>

        {analyzingId ? (
          <AnalysisProgress
            id={analyzingId}
            onDone={() => handleDone(analyzingId)}
            onError={handleError}
          />
        ) : (
          <ContractUploadStatusPanel error={error} hasResult={!!result} />
        )}

        {!analyzingId && result && (
          <div className="space-y-4">
            <AnalysisResults result={result} />
            {result.isContract && result.fullText && (
              <HighlightedContract
                fullText={result.fullText}
                riskyClauses={result.riskyClauses}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
