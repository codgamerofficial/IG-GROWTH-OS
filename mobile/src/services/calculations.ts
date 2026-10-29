// =============================================================================
// RIIQX Quantitative Finance Engine
// Deterministic, Audited Financial Mathematics & Risk Analysis Functions
// Compliant with SEBI Research Standards: No Hallucinations, Pure Formulaic Math
// =============================================================================

export interface CashFlow {
  date: string | Date; // ISO string or Date
  amount: number; // Negative for outflows (investments), positive for inflows
}

export interface HoldingItem {
  id: string;
  name: string;
  symbol: string;
  assetClass:
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
  quantity: number;
  averageBuyPrice: number;
  currentPrice: number;
  currency: 'INR' | 'USD';
  maturityDate?: string;
  interestRatePct?: number;
}

export interface AssetAllocationItem {
  assetClass: HoldingItem['assetClass'];
  label: string;
  totalInvested: number;
  currentValue: number;
  percentage: number;
  color: string;
  count: number;
}

export interface PortfolioSummary {
  totalInvested: number;
  totalCurrentValue: number;
  unrealizedPnL: number;
  unrealizedPnLPct: number;
  healthScore: number;
  healthStatus: 'Excellent' | 'Healthy' | 'Moderate Risk' | 'High Concentration';
  topConcentrationPct: number;
  topAsset: string;
  allocation: AssetAllocationItem[];
}

// 1. Currency Conversion (Default USD/INR FX reference: 84.20)
export function convertCurrency(
  amount: number,
  from: 'INR' | 'USD',
  to: 'INR' | 'USD',
  fxRate = 84.20
): number {
  if (from === to) return amount;
  if (from === 'USD' && to === 'INR') return amount * fxRate;
  if (from === 'INR' && to === 'USD') return amount / fxRate;
  return amount;
}

// 2. Weighted Cost Basis & Unrealized P&L
export function calculateHoldingPnL(holding: HoldingItem, fxRate = 84.20) {
  const investedNative = holding.quantity * holding.averageBuyPrice;
  const currentNative = holding.quantity * holding.currentPrice;

  // Convert to INR base
  const investedINR = convertCurrency(investedNative, holding.currency, 'INR', fxRate);
  const currentINR = convertCurrency(currentNative, holding.currency, 'INR', fxRate);

  const pnlINR = currentINR - investedINR;
  const pnlPct = investedINR > 0 ? (pnlINR / investedINR) * 100 : 0;

  return {
    investedNative,
    currentNative,
    investedINR,
    currentINR,
    pnlINR,
    pnlPct,
  };
}

// 3. Asset Allocation Breakdown
const ASSET_CLASS_LABELS: Record<HoldingItem['assetClass'], { label: string; color: string }> = {
  indian_stock: { label: 'Indian Stocks', color: '#2563EB' },
  mutual_fund: { label: 'Mutual Funds', color: '#7C3AED' },
  us_stock: { label: 'US Equities', color: '#0284C7' },
  etf: { label: 'ETFs', color: '#0D9488' },
  government_bond: { label: 'Govt Bonds', color: '#059669' },
  corporate_bond: { label: 'Corp Bonds', color: '#10B981' },
  reit: { label: 'REITs / InvITs', color: '#D97706' },
  invit: { label: 'InvITs', color: '#B45309' },
  fixed_deposit: { label: 'Fixed Deposits', color: '#4F46E5' },
  gold: { label: 'Gold Bullion', color: '#EAB308' },
  silver: { label: 'Silver', color: '#94A3B8' },
  crypto: { label: 'Crypto Assets', color: '#F59E0B' },
  other: { label: 'Other', color: '#6B7280' },
};

export function calculateAssetAllocation(
  holdings: HoldingItem[],
  fxRate = 84.20
): AssetAllocationItem[] {
  const groupMap: Record<string, { totalInvested: number; currentValue: number; count: number }> = {};

  let grandTotalValue = 0;

  for (const h of holdings) {
    const { investedINR, currentINR } = calculateHoldingPnL(h, fxRate);
    grandTotalValue += currentINR;

    if (!groupMap[h.assetClass]) {
      groupMap[h.assetClass] = { totalInvested: 0, currentValue: 0, count: 0 };
    }
    groupMap[h.assetClass].totalInvested += investedINR;
    groupMap[h.assetClass].currentValue += currentINR;
    groupMap[h.assetClass].count += 1;
  }

  const result: AssetAllocationItem[] = [];

  for (const [key, data] of Object.entries(groupMap)) {
    const meta = ASSET_CLASS_LABELS[key as HoldingItem['assetClass']] || {
      label: key,
      color: '#6B7280',
    };
    const percentage = grandTotalValue > 0 ? (data.currentValue / grandTotalValue) * 100 : 0;

    result.push({
      assetClass: key as HoldingItem['assetClass'],
      label: meta.label,
      totalInvested: Math.round(data.totalInvested),
      currentValue: Math.round(data.currentValue),
      percentage: Number(percentage.toFixed(1)),
      color: meta.color,
      count: data.count,
    });
  }

  // Sort descending by currentValue
  return result.sort((a, b) => b.currentValue - a.currentValue);
}

// 4. Comprehensive Portfolio Summary & Health Audit
export function calculatePortfolioSummary(
  holdings: HoldingItem[],
  fxRate = 84.20
): PortfolioSummary {
  let totalInvested = 0;
  let totalCurrentValue = 0;

  for (const h of holdings) {
    const { investedINR, currentINR } = calculateHoldingPnL(h, fxRate);
    totalInvested += investedINR;
    totalCurrentValue += currentINR;
  }

  const unrealizedPnL = totalCurrentValue - totalInvested;
  const unrealizedPnLPct =
    totalInvested > 0 ? (unrealizedPnL / totalInvested) * 100 : 0;

  const allocation = calculateAssetAllocation(holdings, fxRate);

  // Health Score Calculation (0-100)
  // Factors: Asset diversity (40 pts), Concentration risk (30 pts), Fixed income buffer (30 pts)
  let healthScore = 50;

  // 1. Asset class count
  if (allocation.length >= 4) healthScore += 20;
  else if (allocation.length >= 2) healthScore += 10;

  // 2. Concentration risk: single largest asset class
  const maxClassPct = allocation.length > 0 ? allocation[0].percentage : 0;
  if (maxClassPct <= 35) healthScore += 15;
  else if (maxClassPct <= 55) healthScore += 5;
  else healthScore -= 10;

  // 3. Fixed income / safe liquidity check
  const fixedSafePct = allocation
    .filter((a) => ['fixed_deposit', 'government_bond', 'corporate_bond', 'gold'].includes(a.assetClass))
    .reduce((sum, a) => sum + a.percentage, 0);

  if (fixedSafePct >= 15 && fixedSafePct <= 45) healthScore += 15;
  else if (fixedSafePct > 0) healthScore += 5;

  healthScore = Math.max(10, Math.min(98, healthScore));

  let healthStatus: PortfolioSummary['healthStatus'] = 'Healthy';
  if (healthScore >= 80) healthStatus = 'Excellent';
  else if (healthScore >= 65) healthStatus = 'Healthy';
  else if (healthScore >= 45) healthStatus = 'Moderate Risk';
  else healthStatus = 'High Concentration';

  return {
    totalInvested: Math.round(totalInvested),
    totalCurrentValue: Math.round(totalCurrentValue),
    unrealizedPnL: Math.round(unrealizedPnL),
    unrealizedPnLPct: Number(unrealizedPnLPct.toFixed(2)),
    healthScore,
    healthStatus,
    topConcentrationPct: maxClassPct,
    topAsset: allocation.length > 0 ? allocation[0].label : 'None',
    allocation,
  };
}

// 5. Compound Annual Growth Rate (CAGR)
export function calculateCAGR(beginValue: number, endValue: number, years: number): number {
  if (beginValue <= 0 || endValue <= 0 || years <= 0) return 0;
  return (Math.pow(endValue / beginValue, 1 / years) - 1) * 100;
}

// 6. XIRR (Extended Internal Rate of Return) using Newton-Raphson
export function calculateXIRR(cashFlows: CashFlow[], guess = 0.1): number | null {
  if (cashFlows.length < 2) return null;

  const dates = cashFlows.map((cf) => new Date(cf.date).getTime());
  const minDate = Math.min(...dates);
  const dayFractions = dates.map((d) => (d - minDate) / (1000 * 60 * 60 * 24 * 365));

  let rate = guess;
  const maxIterations = 100;
  const tolerance = 1e-6;

  for (let i = 0; i < maxIterations; i++) {
    let fValue = 0;
    let fDerivative = 0;

    for (let j = 0; j < cashFlows.length; j++) {
      const t = dayFractions[j];
      const factor = Math.pow(1 + rate, t);
      fValue += cashFlows[j].amount / factor;
      fDerivative -= (t * cashFlows[j].amount) / (factor * (1 + rate));
    }

    if (Math.abs(fDerivative) < 1e-12) return null;

    const newRate = rate - fValue / fDerivative;
    if (Math.abs(newRate - rate) < tolerance) {
      return Number((newRate * 100).toFixed(2));
    }
    rate = newRate;
  }

  return Number((rate * 100).toFixed(2));
}

// 7. Maximum Drawdown (Peak to Trough)
export function calculateMaxDrawdown(prices: number[]): { maxDrawdownPct: number; peakIndex: number; troughIndex: number } {
  if (prices.length < 2) return { maxDrawdownPct: 0, peakIndex: 0, troughIndex: 0 };

  let maxDrawdown = 0;
  let peak = prices[0];
  let peakIdx = 0;
  let troughIdx = 0;
  let currentPeakIdx = 0;

  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > peak) {
      peak = prices[i];
      currentPeakIdx = i;
    } else {
      const drawdown = (peak - prices[i]) / peak;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
        peakIdx = currentPeakIdx;
        troughIdx = i;
      }
    }
  }

  return {
    maxDrawdownPct: Number((maxDrawdown * 100).toFixed(2)),
    peakIndex: peakIdx,
    troughIndex: troughIdx,
  };
}

// 8. Financial Goal Compound Projection with Inflation Adjustment
export function calculateGoalProjection(params: {
  currentSavings: number;
  monthlySip: number;
  targetAmount: number;
  targetDate: string; // YYYY-MM-DD
  expectedReturnRatePct: number;
  inflationRatePct: number;
}) {
  const { currentSavings, monthlySip, targetAmount, targetDate, expectedReturnRatePct, inflationRatePct } = params;

  const now = new Date();
  const target = new Date(targetDate);
  const diffMonths = Math.max(1, Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30.4375)));
  const years = diffMonths / 12;

  const r = expectedReturnRatePct / 100 / 12;
  const inf = inflationRatePct / 100;

  // Future Value of Current Corpus
  const fvLumpsum = currentSavings * Math.pow(1 + r, diffMonths);

  // Future Value of Monthly SIP (annuity formula)
  const fvSip = monthlySip * ((Math.pow(1 + r, diffMonths) - 1) / r) * (1 + r);

  const projectedNominalCorpus = Math.round(fvLumpsum + fvSip);

  // Inflation-adjusted future cost of the target goal
  const inflationAdjustedTarget = Math.round(targetAmount * Math.pow(1 + inf, years));

  // Required Monthly SIP to hit the target
  const remainingTargetAfterLumpsum = Math.max(0, inflationAdjustedTarget - fvLumpsum);
  const requiredMonthlySip =
    remainingTargetAfterLumpsum > 0
      ? Math.round(remainingTargetAfterLumpsum / (((Math.pow(1 + r, diffMonths) - 1) / r) * (1 + r)))
      : 0;

  const isFundedOnTrack = projectedNominalCorpus >= inflationAdjustedTarget;
  const progressPct = Math.min(100, Math.round((projectedNominalCorpus / inflationAdjustedTarget) * 100));

  return {
    monthsRemaining: diffMonths,
    yearsRemaining: Number(years.toFixed(1)),
    projectedNominalCorpus,
    inflationAdjustedTarget,
    requiredMonthlySip,
    isFundedOnTrack,
    progressPct,
  };
}
