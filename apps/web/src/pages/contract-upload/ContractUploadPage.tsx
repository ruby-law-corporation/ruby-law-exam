import { useState } from 'react';
import type { ReactElement } from 'react';
import type { ContractAnalysis } from '@app/core';
import { CircleAlert, FileSearch, Loader2 } from 'lucide-react';
import { AnalysisResults, UploadForm } from '@/features/contract-analysis';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
} from '@/shared/ui';

export function ContractUploadPage(): ReactElement {
  const [result, setResult] = useState<ContractAnalysis | null>(null);
  const [error, setError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSuccess = (analysis: ContractAnalysis) => {
    setResult(analysis);
    setError('');
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
            <UploadForm
              onSuccess={handleSuccess}
              onError={setError}
              onAnalyzingChange={setIsAnalyzing}
            />
          </CardContent>
        </Card>

        {error && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/35 bg-destructive/10 p-4 text-sm text-destructive">
            <CircleAlert className="mt-0.5 size-4 shrink-0" />
            {error}
          </div>
        )}

        {isAnalyzing && (
          <Card>
            <CardContent>
              <EmptyState
                icon={Loader2}
                title="Analyzing your contract…"
                description="Extracting text and running the AI analysis. This can take a few seconds."
                className="[&_svg]:animate-spin"
              />
            </CardContent>
          </Card>
        )}

        {!isAnalyzing && result && <AnalysisResults result={result} />}

        {!isAnalyzing && !result && !error && (
          <Card>
            <CardContent>
              <EmptyState
                icon={FileSearch}
                title="No analysis yet"
                description="Upload a contract above to see its risk score, missing clauses, and recommendations."
              />
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
