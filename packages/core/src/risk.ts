export type RiskSeverity = 'low' | 'medium' | 'high';

export const RISK_THRESHOLDS = { high: 70, medium: 40 } as const;

const RISK_LABELS: Record<RiskSeverity, string> = {
  high: 'High risk',
  medium: 'Medium risk',
  low: 'Low risk',
};

export interface RiskLevel {
  severity: RiskSeverity;
  label: string;
}

export const getRiskSeverity = (score: number): RiskSeverity => {
  if (score >= RISK_THRESHOLDS.high) return 'high';
  if (score >= RISK_THRESHOLDS.medium) return 'medium';
  return 'low';
};

export const getRiskLevel = (score: number): RiskLevel => {
  const severity = getRiskSeverity(score);
  return { severity, label: RISK_LABELS[severity] };
};
