import { useRef, useState } from 'react';
import type { ChangeEvent, DragEvent, ReactElement } from 'react';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/shared/lib';

interface UploadInputProps {
  accept: string;
  onSelect: (file: File) => void;
}

export function UploadInput({
  accept,
  onSelect,
}: UploadInputProps): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const candidate = event.target.files?.[0];
    if (candidate) onSelect(candidate);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const candidate = event.dataTransfer.files?.[0];
    if (candidate) onSelect(candidate);
  };

  return (
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
        accept={accept}
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
