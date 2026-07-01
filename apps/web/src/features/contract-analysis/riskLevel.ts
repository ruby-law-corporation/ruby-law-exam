import type { VariantProps } from 'class-variance-authority';
import type { badgeVariants } from '@/shared/ui';

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;

interface RiskLevel {
  label: string;
  badge: Extract<BadgeVariant, 'low' | 'medium' | 'high'>;
  bar: string;
}

export const getRiskLevel = (score: number): RiskLevel => {
  if (score >= 70)
    return { label: 'High risk', badge: 'high', bar: 'bg-destructive' };
  if (score >= 40)
    return { label: 'Medium risk', badge: 'medium', bar: 'bg-warning' };
  return { label: 'Low risk', badge: 'low', bar: 'bg-success' };
};
