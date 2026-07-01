import { useState } from 'react';
import type { ReactElement } from 'react';
import type { ContractAnalysis } from '@app/core';
import { FileText, Loader2, X } from 'lucide-react';
import { CONTRACT_UPLOAD_ROUTE } from './constants';
import { requestData } from '@/shared/api';
import {
  ACCEPTED_EXTENSIONS,
  formatFileSize,
  toFormData,
  validateFile,
} from '@/shared/lib';
import { Button, UploadInput } from '@/shared/ui';

interface UploadFormProps {
  onSuccess: (result: ContractAnalysis) => void;
  onError: (message: string) => void;
  onAnalyzingChange: (analyzing: boolean) => void;
}

export function UploadForm({
  onSuccess,
  onError,
  onAnalyzingChange,
}: UploadFormProps): ReactElement {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const selectFile = (candidate: File) => {
    const validationError = validateFile(candidate);
    if (validationError) {
      onError(validationError);
      return;
    }
    onError('');
    setFile(candidate);
  };

  const clearFile = () => {
    setFile(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsUploading(true);
    onAnalyzingChange(true);
    onError('');
    try {
      const result = await requestData<ContractAnalysis>(
        CONTRACT_UPLOAD_ROUTE,
        { method: 'POST', body: toFormData({ file }) },
      );
      onSuccess(result);
      clearFile();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      onAnalyzingChange(false);
    }
  };

  return (
    <div className="space-y-4">
      <UploadInput accept={ACCEPTED_EXTENSIONS} onSelect={selectFile} />
      {file && (
        <div className="flex items-center gap-3 rounded-md border border-border bg-card p-3">
          <FileText className="size-5 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground tabular-nums">
              {formatFileSize(file.size)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={clearFile}
            disabled={isUploading}
            aria-label="Remove file"
          >
            <X />
          </Button>
        </div>
      )}
      <Button
        size="lg"
        className="w-full"
        onClick={handleAnalyze}
        disabled={!file || isUploading}
      >
        {isUploading ? (
          <>
            <Loader2 className="animate-spin" />
            Analyzing…
          </>
        ) : (
          'Analyze contract'
        )}
      </Button>
    </div>
  );
}
