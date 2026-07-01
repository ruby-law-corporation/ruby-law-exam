import * as React from 'react';
import { cn } from '@/shared/lib';

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-muted-foreground', className)}
      {...props}
    />
  );
}

export { CardDescription };
