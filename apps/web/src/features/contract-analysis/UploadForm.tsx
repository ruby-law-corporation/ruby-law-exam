import { useRef, useState } from 'react';
import type { ChangeEvent, DragEvent, ReactElement } from 'react';
import type { ContractAnalysis } from '@app/types';
import { FileText, Loader2, UploadCloud, X } from 'lucide-react';
import { uploadContract } from './api';
import {
  ACCEPTED_EXTENSIONS,
  cn,
  formatFileSize,
  validateFile,
} from '@/shared/lib';
import { Button } from '@/shared/ui';

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
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
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

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const candidate = event.target.files?.[0];
    if (candidate) selectFile(candidate);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const candidate = event.dataTransfer.files?.[0];
    if (candidate) selectFile(candidate);
  };

  const clearFile = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsUploading(true);
    onAnalyzingChange(true);
    onError('');
    try {
      const result = await uploadContract(file);
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
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/40 p-10 text-center transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50',
          isDragging && 'border-ring bg-muted',
        )}
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-background text-muted-foreground">
          <UploadCloud className="size-6" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            Drag & drop a contract, or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            PDF or DOCX, up to 10 MB
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS}
          className="hidden"
          onChange={handleInputChange}
        />
      </div>
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
