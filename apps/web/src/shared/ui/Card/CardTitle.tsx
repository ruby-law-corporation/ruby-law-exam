import * as React from 'react';
import { cn } from '@/shared/lib';

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('leading-snug font-medium', className)}
      {...props}
    />
  );
}

export { CardTitle };
