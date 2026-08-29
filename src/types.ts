export type InvestmentType = 'FD' | 'RD' | 'Stock' | 'Mutual Fund' | 'Gold' | 'Real Estate' | 'Other';

export interface Investment {
  id: string;
  type: InvestmentType;
  name: string;
  principal: number;
  rate: number; // Annual interest rate or expected growth percentage (e.g. 7.5 for 7.5%)
  startDate: string; // YYYY-MM-DD
  maturityDate?: string; // YYYY-MM-DD
  reviewDate?: string; // YYYY-MM-DD
  monthlyContribution?: number; // RD or SIP monthly amount
  compoundingFrequency: 'monthly' | 'quarterly' | 'half-yearly' | 'yearly';
  status: 'active' | 'matured' | 'reviewed';
  notes: string;
  googleEventId?: string; // Synced google calendar event id for maturity
  reviewGoogleEventId?: string; // Synced event id for review
}

export interface InvestmentNote {
  id: string;
  investmentId: string;
  title: string;
  body: string;
  date: string; // YYYY-MM-DD
  tag?: 'Maturity' | 'Review' | 'General' | 'Tax' | 'Dividend';
}

export interface EMICalculatorInput {
  principal: number;
  rate: number;
  tenureMonths: number;
}

export interface EMICalculatorOutput {
  monthlyEMI: number;
  totalInterest: number;
  totalPayment: number;
  schedule: Array<{
    month: number;
    emi: number;
    principalPaid: number;
    interestPaid: number;
    remainingBalance: number;
  }>;
}

export interface ReturnCalculatorInput {
  principal: number;
  rate: number;
  tenureYears: number;
  type: 'LumpSum' | 'SIP' | 'RD';
  monthlyContribution?: number;
  compoundingFrequency?: 'monthly' | 'quarterly' | 'half-yearly' | 'yearly';
}

export interface ReturnCalculatorOutput {
  investedAmount: number;
  estimatedReturns: number;
  totalValue: number;
  yearlyBreakdown: Array<{
    year: number;
    invested: number;
    interest: number;
    total: number;
  }>;
}

export interface GoogleCalendarConfig {
  clientId: string;
  accessToken: string | null;
  expiresAt: number | null; // epoch ms
}
