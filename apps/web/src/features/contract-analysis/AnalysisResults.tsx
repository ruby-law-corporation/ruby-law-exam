import type { ReactElement } from 'react';
import type { ContractAnalysis } from '@app/types';
import { CheckCircle2, CircleAlert, Lightbulb } from 'lucide-react';
import { getRiskLevel } from './riskLevel';
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
} from '@/shared/ui';

interface AnalysisResultsProps {
  result: ContractAnalysis;
}

export function AnalysisResults({
  result,
}: AnalysisResultsProps): ReactElement {
  const { type, riskScore, missingClauses, recommendations, filename } = result;
  const risk = getRiskLevel(riskScore);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            {filename}
            <Badge variant="secondary" size="md">
              {type}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Risk score</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-medium tabular-nums">
                {riskScore}
              </span>
              <Badge variant={risk.badge} size="md">
                {risk.label}
              </Badge>
            </div>
          </div>
          <Progress value={riskScore} indicatorClassName={risk.bar} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CircleAlert className="size-4 text-muted-foreground" />
            Missing clauses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {missingClauses.length === 0 ? (
            <p className="flex items-center gap-2 text-sm text-success">
              <CheckCircle2 className="size-4" />
              No missing clauses detected
            </p>
          ) : (
            <ul className="space-y-2">
              {missingClauses.map((clause) => (
                <li key={clause} className="flex items-start gap-2 text-sm">
                  <CircleAlert className="mt-0.5 size-4 shrink-0 text-warning" />
                  {clause}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="size-4 text-muted-foreground" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recommendations.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recommendations.</p>
          ) : (
            <ul className="space-y-2">
              {recommendations.map((recommendation) => (
                <li
                  key={recommendation}
                  className="flex items-start gap-2 text-sm"
                >
                  <Lightbulb className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  {recommendation}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
