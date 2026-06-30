import type { ContractAnalysis } from '@app/types';

// Simple in-memory store — no database required for this feature.
export const contractStore = new Map<string, ContractAnalysis>();
