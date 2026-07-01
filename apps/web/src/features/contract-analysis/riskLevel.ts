import { getRiskLevel as getSharedRiskLevel } from '@app/core';
import type { RiskSeverity } from '@app/core';

interface RiskLevel {
  label: string;
  badge: RiskSeverity;
  bar: string;
}

const RISK_BARS: Record<RiskSeverity, string> = {
  high: 'bg-destructive',
  medium: 'bg-warning',
  low: 'bg-success',
};

export const getRiskLevel = (score: number): RiskLevel => {
  const { severity, label } = getSharedRiskLevel(score);
  return { label, badge: severity, bar: RISK_BARS[severity] };
};
