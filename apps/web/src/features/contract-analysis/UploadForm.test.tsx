import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { UploadForm } from './UploadForm';

const makeFile = (name: string, type: string): File =>
  new File(['x'], name, { type });

describe('UploadForm', () => {
  it('reports a validation error when an unsupported file is selected', () => {
    const onError = vi.fn();
    const { container } = render(
      <UploadForm
        onSuccess={vi.fn()}
        onError={onError}
        onAnalyzingChange={vi.fn()}
      />,
    );
    const input =
      container.querySelector<HTMLInputElement>('input[type="file"]');
    expect(input).not.toBeNull();
    fireEvent.change(input!, {
      target: { files: [makeFile('image.png', 'image/png')] },
    });
    expect(onError).toHaveBeenCalledWith(
      'Only .pdf and .docx files are accepted',
    );
  });

  it('disables the analyze button until a valid file is chosen', () => {
    render(
      <UploadForm
        onSuccess={vi.fn()}
        onError={vi.fn()}
        onAnalyzingChange={vi.fn()}
      />,
    );
    expect(
      screen.getByRole('button', { name: /analyze contract/i }),
    ).toBeDisabled();
  });
});
