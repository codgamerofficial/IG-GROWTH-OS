// =============================================================================
// RIIQX Market Data Engine — Type Definitions & Normalized Schemas
// Multi-Provider Architecture with Provenance, Timestamps & Delay Indicators
// =============================================================================

export type AssetClass =
  | 'indian_stock'
  | 'mutual_fund'
  | 'us_stock'
  | 'etf'
  | 'government_bond'
  | 'corporate_bond'
  | 'reit'
  | 'invit'
  | 'fixed_deposit'
  | 'gold'
  | 'silver'
  | 'crypto'
  | 'other';

export interface MarketQuote {
  symbol: string;
  name: string;
  assetClass: AssetClass;
  price: number;
  currency: 'INR' | 'USD';
  dayChange: number;
  dayChangePct: number;
  timestamp: string; // ISO
  providerId: 'mfapi' | 'tapetide' | 'alphavantage' | 'rbi_retail' | 'institutional_fd' | 'manual';
  providerName: string;
  isDelayed: boolean;
  delayMinutes: number;
  isStale: boolean;
  peRatio?: number;
  expenseRatio?: number;
  dividendYield?: number;
  interestRate?: number;
  tenureMonths?: number;
  creditRating?: string;
  dicgcInsured?: boolean;
  marketCap?: string;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  aum?: string;
  fundCategory?: string;
  returns3Y?: number;
  returns5Y?: number;
  volume24h?: string;
  circulatingSupply?: string;
  allTimeHigh?: number;
  allTimeLow?: number;
}

export interface HistoricalDataPoint {
  date: string; // YYYY-MM-DD
  price: number;
}

export interface ProviderHealth {
  id: string;
  name: string;
  tier: 'free' | 'official' | 'curated';
  dailyCallLimit: number;
  callsUsedToday: number;
  isActive: boolean;
  lastChecked: string;
  statusMessage: string;
}

export interface AssetScreenerFilter {
  query?: string;
  assetClasses?: AssetClass[];
  minBudget?: number;
  maxBudget?: number;
  riskTolerance?: 'conservative' | 'moderate' | 'aggressive';
  investmentHorizon?: 'short' | 'medium' | 'long';
  liquidity?: 'instant' | 'tenure' | 'lockin';
  minReturnPct?: number;
  maxExpenseRatio?: number;
  creditRating?: string;
}
