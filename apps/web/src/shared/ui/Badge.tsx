import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib';

const badgeVariants = cva(
  'group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground [a]:hover:bg-primary/80',
        secondary:
          'bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80',
        outline:
          'border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground',
        high: 'border-destructive/35 bg-destructive/15 text-destructive dark:bg-destructive/25',
        medium:
          'border-warning/35 bg-warning/15 text-warning dark:bg-warning/25',
        low: 'border-success/35 bg-success/15 text-success dark:bg-success/25',
        info: 'bg-muted text-muted-foreground',
      },
      size: {
        sm: 'h-5 px-2 py-0.5 text-xs',
        md: 'h-6 px-3 py-1 text-xs',
      },
    },
    defaultVariants: { variant: 'default', size: 'sm' },
  },
);

function Badge({
  className,
  variant = 'default',
  size = 'sm',
  render,
  ...props
}: useRender.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(
      { className: cn(badgeVariants({ variant, size }), className) },
      props,
    ),
    render,
    state: { slot: 'badge', variant, size },
  });
}

export { Badge, badgeVariants };
