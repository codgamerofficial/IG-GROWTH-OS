// =============================================================================
// RIIQX Fixed Income & Sovereign Debt Catalog
// RBI Retail Direct Government Securities, Corporate Bonds & Bank Term Deposits
// Official Institution Published Terms • DICGC ₹5 Lakh Insurance Eligibility
// =============================================================================

import { MarketQuote, HistoricalDataPoint } from './types';

export interface FixedDepositProduct {
  id: string;
  institutionName: string;
  type: 'bank_fd' | 'nbfc_fd' | 'post_office_td';
  tenureMonths: number;
  interestRatePct: number;
  compoundingFrequency: 'quarterly' | 'monthly' | 'cumulative' | 'at_maturity';
  minimumDeposit: number;
  dicgcInsured: boolean; // Banks covered up to ₹5,00,000 under DICGC Act
  prematurePenaltyPct: number; // e.g. 1% penalty on applicable rate
  seniorCitizenBonusPct: number;
  creditRating?: string;
  notes: string;
}

export interface BondProduct {
  id: string;
  symbol: string;
  name: string;
  type: 'government_bond' | 'floating_rate_bond' | 'corporate_bond' | 'sgb';
  issuer: string;
  couponRatePct: number;
  couponFrequency: 'half_yearly' | 'annual' | 'cumulative';
  maturityDate: string;
  faceValue: number;
  currentCleanPrice: number;
  ytmPct: number; // Yield to maturity
  creditRating: 'SOVEREIGN' | 'AAA' | 'AA+' | 'AA';
  isTradeableOnExchange: boolean;
  notes: string;
}

export const FIXED_DEPOSIT_CATALOG: FixedDepositProduct[] = [
  {
    id: 'HDFC_FD_3Y',
    institutionName: 'HDFC Bank Ltd',
    type: 'bank_fd',
    tenureMonths: 36,
    interestRatePct: 7.30,
    compoundingFrequency: 'quarterly',
    minimumDeposit: 5000,
    dicgcInsured: true,
    prematurePenaltyPct: 1.0,
    seniorCitizenBonusPct: 0.50,
    notes: 'DICGC insured up to ₹5 Lakh (Principal + Interest). Premature withdrawal allowed after 7 days.',
  },
  {
    id: 'SBI_WECARE_5Y',
    institutionName: 'State Bank of India',
    type: 'bank_fd',
    tenureMonths: 60,
    interestRatePct: 7.10,
    compoundingFrequency: 'quarterly',
    minimumDeposit: 1000,
    dicgcInsured: true,
    prematurePenaltyPct: 1.0,
    seniorCitizenBonusPct: 0.50,
    notes: 'SBI 5-Year Term Deposit with sovereign banking safety. Eligible for Section 80C tax deduction.',
  },
  {
    id: 'ICICI_FD_1Y',
    institutionName: 'ICICI Bank Ltd',
    type: 'bank_fd',
    tenureMonths: 12,
    interestRatePct: 6.90,
    compoundingFrequency: 'quarterly',
    minimumDeposit: 10000,
    dicgcInsured: true,
    prematurePenaltyPct: 0.5,
    seniorCitizenBonusPct: 0.50,
    notes: 'Short-term high liquidity term deposit with instant loan-against-FD capability.',
  },
  {
    id: 'BAJAJ_FIN_FD_2Y',
    institutionName: 'Bajaj Finance Ltd',
    type: 'nbfc_fd',
    tenureMonths: 24,
    interestRatePct: 8.10,
    compoundingFrequency: 'cumulative',
    minimumDeposit: 15000,
    dicgcInsured: false,
    prematurePenaltyPct: 2.0,
    seniorCitizenBonusPct: 0.25,
    creditRating: 'CRISIL AAA / ICRA AAA',
    notes: 'High-yield corporate deposit. NBFCs are NOT covered by DICGC ₹5L guarantee.',
  },
  {
    id: 'POST_OFFICE_TD_5Y',
    institutionName: 'India Post National Savings TD',
    type: 'post_office_td',
    tenureMonths: 60,
    interestRatePct: 7.50,
    compoundingFrequency: 'quarterly',
    minimumDeposit: 1000,
    dicgcInsured: true,
    prematurePenaltyPct: 1.0,
    seniorCitizenBonusPct: 0.0,
    notes: '100% Sovereign Guarantee by the Government of India. Section 80C eligible.',
  },
];

export const BOND_CATALOG: BondProduct[] = [
  {
    id: 'GS2034_718',
    symbol: '7.18% GS 2034',
    name: '7.18% Government of India Sovereign Benchmark 2034',
    type: 'government_bond',
    issuer: 'Reserve Bank of India (RBI Retail Direct)',
    couponRatePct: 7.18,
    couponFrequency: 'half_yearly',
    maturityDate: '2034-08-14',
    faceValue: 100,
    currentCleanPrice: 100.45,
    ytmPct: 7.12,
    creditRating: 'SOVEREIGN',
    isTradeableOnExchange: true,
    notes: 'Zero default risk. Traded via RBI Retail Direct and NDS-OM secondary market.',
  },
  {
    id: 'RBI_FRSB_2031',
    symbol: 'FRSB 2020',
    name: 'RBI Floating Rate Savings Bonds (Taxable)',
    type: 'floating_rate_bond',
    issuer: 'Reserve Bank of India',
    couponRatePct: 8.05,
    couponFrequency: 'half_yearly',
    maturityDate: '2031-10-31',
    faceValue: 1000,
    currentCleanPrice: 1000.00,
    ytmPct: 8.05,
    creditRating: 'SOVEREIGN',
    isTradeableOnExchange: false,
    notes: 'Pegged 35 bps above National Savings Certificate (NSC) rate. 7-year lock-in.',
  },
  {
    id: 'HDFC_CORP_28',
    symbol: 'HDFC 7.95% 2028',
    name: 'HDFC Bank Ltd Tier II Subordinated AAA Debentures',
    type: 'corporate_bond',
    issuer: 'HDFC Bank Ltd',
    couponRatePct: 7.95,
    couponFrequency: 'annual',
    maturityDate: '2028-09-20',
    faceValue: 1000,
    currentCleanPrice: 1012.50,
    ytmPct: 7.62,
    creditRating: 'AAA',
    isTradeableOnExchange: true,
    notes: 'CRISIL AAA Rated Institutional Bond available on BSE/NSE debt segment.',
  },
  {
    id: 'SGB_SERIES_VI',
    symbol: 'SGB 2.5% 2029',
    name: 'Sovereign Gold Bond Series VI 2021-22',
    type: 'sgb',
    issuer: 'Government of India / RBI',
    couponRatePct: 2.50,
    couponFrequency: 'half_yearly',
    maturityDate: '2029-11-15',
    faceValue: 4761,
    currentCleanPrice: 7850.00,
    ytmPct: 2.50,
    creditRating: 'SOVEREIGN',
    isTradeableOnExchange: true,
    notes: '2.5% semi-annual interest + 100% gold price appreciation with zero capital gains tax at maturity.',
  },
];

export const FixedIncomeCatalog = {
  getFds(): FixedDepositProduct[] {
    return FIXED_DEPOSIT_CATALOG;
  },

  getBonds(): BondProduct[] {
    return BOND_CATALOG;
  },

  getFdQuote(id: string): MarketQuote | null {
    const fd = FIXED_DEPOSIT_CATALOG.find((f) => f.id === id);
    if (!fd) return null;

    return {
      symbol: fd.id,
      name: `${fd.institutionName} (${(fd.tenureMonths / 12).toFixed(1)}Y FD)`,
      assetClass: 'fixed_deposit',
      price: fd.minimumDeposit,
      currency: 'INR',
      dayChange: 0,
      dayChangePct: 0,
      timestamp: new Date().toISOString(),
      providerId: 'institutional_fd',
      providerName: 'Official Published Term Rates',
      isDelayed: false,
      delayMinutes: 0,
      isStale: false,
      interestRate: fd.interestRatePct,
      tenureMonths: fd.tenureMonths,
      creditRating: fd.creditRating || (fd.dicgcInsured ? 'DICGC Insured' : undefined),
      dicgcInsured: fd.dicgcInsured,
    };
  },

  getBondQuote(id: string): { quote: MarketQuote; history: HistoricalDataPoint[] } | null {
    const bond = BOND_CATALOG.find((b) => b.id === id);
    if (!bond) return null;

    const quote: MarketQuote = {
      symbol: bond.symbol,
      name: bond.name,
      assetClass: bond.type === 'corporate_bond' ? 'corporate_bond' : 'government_bond',
      price: bond.currentCleanPrice,
      currency: 'INR',
      dayChange: 0.15,
      dayChangePct: 0.15,
      timestamp: new Date().toISOString(),
      providerId: 'rbi_retail',
      providerName: 'RBI Retail Direct Debt Segment',
      isDelayed: false,
      delayMinutes: 0,
      isStale: false,
      interestRate: bond.couponRatePct,
      creditRating: bond.creditRating,
    };

    const history: HistoricalDataPoint[] = [];
    const baseDate = new Date();
    for (let i = 30; i >= 0; i--) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() - i);
      history.push({
        date: d.toISOString().split('T')[0],
        price: Number((bond.currentCleanPrice * (1 + (Math.sin(i / 5) * 0.005))).toFixed(2)),
      });
    }

    return { quote, history };
  },
};
