import PDFDocument from 'pdfkit';
import { getRiskLevel, type ContractAnalysis } from '@app/core';
import type { RiskSeverity } from '@app/core';

const RISK_COLORS: Record<RiskSeverity, string> = {
  high: '#8b4a4a',
  medium: '#8f5a12',
  low: '#2f6b4a',
};

export function generateReportName(record: ContractAnalysis): string {
  const baseName = record.filename.replace(/\.[^.]+$/, '');
  return `${baseName}-report`;
}

export function generateReportPdf(record: ContractAnalysis): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 56 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(20).text('Contract Analysis Report', { underline: false });
    doc.moveDown(0.5);

    doc.fontSize(11).fillColor('#666666');
    doc.text(record.filename);
    doc.text(`Type: ${record.type}`);
    doc.text(`Generated: ${new Date(record.createdAt).toLocaleString()}`);
    doc.fillColor('#000000');
    doc.moveDown();

    const risk = getRiskLevel(record.riskScore);
    doc.fontSize(14).fillColor('#000000').text('Risk score');
    doc.fontSize(24).fillColor(RISK_COLORS[risk.severity]);
    doc.text(`${record.riskScore}  —  ${risk.label}`);
    doc.fillColor('#000000');
    doc.moveDown();

    doc.fontSize(14).text('Missing clauses');
    doc.moveDown(0.25);
    doc.fontSize(11);
    if (record.missingClauses.length === 0) {
      doc.text('No missing clauses detected.');
    } else {
      record.missingClauses.forEach((clause) => doc.text(`• ${clause}`));
    }
    doc.moveDown();

    doc.fontSize(14).text('Recommendations');
    doc.moveDown(0.25);
    doc.fontSize(11);
    if (record.recommendations.length === 0) {
      doc.text('No recommendations.');
    } else {
      record.recommendations.forEach((rec) => doc.text(`• ${rec}`));
    }

    doc.end();
  });
}
