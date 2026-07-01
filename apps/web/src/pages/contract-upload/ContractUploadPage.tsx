import { useState } from 'react';
import type { ReactElement } from 'react';
import type { ContractAnalysis } from '@app/core';
import { ContractUploadStatusPanel } from './ContractUploadStatusPanel';
import { AnalysisResults } from '@/features/analysis';
import { HighlightedContract } from '@/features/highlighting';
import { UploadForm } from '@/features/upload';
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSuccess = (analysis: ContractAnalysis) => {
    setResult(analysis);
    setError('');
  };

  const showResult = !isAnalyzing && result;

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
            <UploadForm
              onSuccess={handleSuccess}
              onError={setError}
              onAnalyzingChange={setIsAnalyzing}
            />
          </CardContent>
        </Card>

        <ContractUploadStatusPanel
          error={error}
          isAnalyzing={isAnalyzing}
          hasResult={result !== null}
        />

        {showResult && (
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
