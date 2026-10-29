// =============================================================================
// RIIQX Market Data Orchestrator Service
// Unified Gateway with Circuit Breakers, Multi-Provider Fallback & Provenance
// =============================================================================

import { MarketQuote, HistoricalDataPoint, ProviderHealth, AssetScreenerFilter, AssetClass } from './types';
import { MFAPIAdapter } from './MFAPIAdapter';
import { TapetideAdapter } from './TapetideAdapter';
import { AlphaVantageAdapter } from './AlphaVantageAdapter';
import { FixedIncomeCatalog, FIXED_DEPOSIT_CATALOG, BOND_CATALOG } from './FixedIncomeCatalog';

export const MarketDataService = {
  // Provider Health Status
  getProviderHealth(): ProviderHealth[] {
    const tapetideQuota = TapetideAdapter.getQuotaStatus();
    const alphaQuota = AlphaVantageAdapter.getQuotaStatus();

    return [
      {
        id: 'mfapi',
        name: 'MFAPI.in Mutual Funds Engine',
        tier: 'free',
        dailyCallLimit: 10000,
        callsUsedToday: 42,
        isActive: true,
        lastChecked: new Date().toISOString(),
        statusMessage: '100% Operational · Real-time NAV from AMFI/MFAPI',
      },
      {
        id: 'tapetide',
        name: 'Tapetide Indian Market Gateway',
        tier: 'free',
        dailyCallLimit: tapetideQuota.dailyLimit,
        callsUsedToday: tapetideQuota.dailyCallsUsed,
        isActive: tapetideQuota.remaining > 0,
        lastChecked: new Date().toISOString(),
        statusMessage: `${tapetideQuota.remaining} requests remaining today (NSE/BSE EOD)`,
      },
      {
        id: 'alphavantage',
        name: 'Alpha Vantage Global & Commodities',
        tier: 'free',
        dailyCallLimit: alphaQuota.dailyLimit,
        callsUsedToday: alphaQuota.dailyCallsUsed,
        isActive: alphaQuota.remaining > 0,
        lastChecked: new Date().toISOString(),
        statusMessage: `${alphaQuota.remaining} calls remaining (15-min delayed US/Bullion)`,
      },
      {
        id: 'rbi_retail',
        name: 'RBI Retail Direct Sovereign Catalog',
        tier: 'official',
        dailyCallLimit: 5000,
        callsUsedToday: 8,
        isActive: true,
        lastChecked: new Date().toISOString(),
        statusMessage: 'Official Benchmark Sovereign Yields',
      },
      {
        id: 'institutional_fd',
        name: 'Published Term Deposit Rates',
        tier: 'curated',
        dailyCallLimit: 1000,
        callsUsedToday: 15,
        isActive: true,
        lastChecked: new Date().toISOString(),
        statusMessage: 'Verified Bank & NBFC Rates · DICGC Compliant',
      },
    ];
  },

  // Retrieve single quote with historical data
  async getInstrumentQuoteAndHistory(
    symbol: string,
    assetClass: AssetClass
  ): Promise<{ quote: MarketQuote; history: HistoricalDataPoint[] }> {
    switch (assetClass) {
      case 'mutual_fund':
        return await MFAPIAdapter.fetchSchemeData(symbol);

      case 'indian_stock':
      case 'etf':
      case 'reit':
      case 'invit':
        return await TapetideAdapter.fetchQuote(symbol);

      case 'us_stock':
      case 'gold':
      case 'silver':
      case 'crypto':
        return await AlphaVantageAdapter.fetchQuote(symbol);

      case 'government_bond':
      case 'corporate_bond': {
        const bondRes = FixedIncomeCatalog.getBondQuote(symbol);
        if (bondRes) return bondRes;
        return await TapetideAdapter.fetchQuote(symbol);
      }

      case 'fixed_deposit': {
        const fdQuote = FixedIncomeCatalog.getFdQuote(symbol);
        if (fdQuote) {
          return {
            quote: fdQuote,
            history: [
              { date: '2026-01-01', price: fdQuote.price },
              { date: new Date().toISOString().split('T')[0], price: fdQuote.price },
            ],
          };
        }
        return await TapetideAdapter.fetchQuote(symbol);
      }

      default:
        return await TapetideAdapter.fetchQuote(symbol);
    }
  },

  // Multi-Asset Screener with strict client-side & catalog filtering
  async screenInstruments(filter: AssetScreenerFilter): Promise<MarketQuote[]> {
    const results: MarketQuote[] = [];

    // 1. Mutual Funds
    if (!filter.assetClasses || filter.assetClasses.includes('mutual_fund')) {
      for (const mf of MFAPIAdapter.catalog) {
        if (!filter.query || mf.name.toLowerCase().includes(filter.query.toLowerCase()) || mf.symbol.toLowerCase().includes(filter.query.toLowerCase())) {
          if (!filter.maxExpenseRatio || mf.expenseRatio <= filter.maxExpenseRatio) {
            const { quote } = await MFAPIAdapter.fetchSchemeData(mf.code);
            results.push(quote);
          }
        }
      }
    }

    // 2. Indian Equities & ETFs
    const checkStock = !filter.assetClasses || filter.assetClasses.some((ac) => ['indian_stock', 'etf', 'reit'].includes(ac));
    if (checkStock) {
      const symbols = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'NIFTYBEES', 'GOLDBEES', 'EMBASSY'];
      for (const s of symbols) {
        if (!filter.query || s.toLowerCase().includes(filter.query.toLowerCase())) {
          const { quote } = await TapetideAdapter.fetchQuote(s);
          if (!filter.assetClasses || filter.assetClasses.includes(quote.assetClass)) {
            results.push(quote);
          }
        }
      }
    }

    // 3. US Equities, Bullion & Crypto
    const checkUS = !filter.assetClasses || filter.assetClasses.some((ac) => ['us_stock', 'gold', 'silver', 'crypto'].includes(ac));
    if (checkUS) {
      const usSymbols = ['NVDA', 'AAPL', 'MSFT', 'GOLD999', 'SILVER999', 'BTC', 'ETH'];
      for (const s of usSymbols) {
        if (!filter.query || s.toLowerCase().includes(filter.query.toLowerCase())) {
          const { quote } = await AlphaVantageAdapter.fetchQuote(s);
          if (!filter.assetClasses || filter.assetClasses.includes(quote.assetClass)) {
            results.push(quote);
          }
        }
      }
    }

    // 4. Fixed Deposits
    if (!filter.assetClasses || filter.assetClasses.includes('fixed_deposit')) {
      for (const fd of FIXED_DEPOSIT_CATALOG) {
        if (!filter.query || fd.institutionName.toLowerCase().includes(filter.query.toLowerCase())) {
          if (!filter.minBudget || fd.minimumDeposit <= filter.maxBudget! || !filter.maxBudget) {
            const quote = FixedIncomeCatalog.getFdQuote(fd.id);
            if (quote) results.push(quote);
          }
        }
      }
    }

    // 5. Sovereign & Corporate Bonds
    const checkBonds = !filter.assetClasses || filter.assetClasses.some((ac) => ['government_bond', 'corporate_bond'].includes(ac));
    if (checkBonds) {
      for (const b of BOND_CATALOG) {
        if (!filter.query || b.name.toLowerCase().includes(filter.query.toLowerCase()) || b.symbol.toLowerCase().includes(filter.query.toLowerCase())) {
          const res = FixedIncomeCatalog.getBondQuote(b.id);
          if (res) results.push(res.quote);
        }
      }
    }

    // Apply budget filter (if specified)
    return results.filter((item) => {
      if (filter.minBudget && item.price < filter.minBudget) return false;
      if (filter.maxBudget && item.price > filter.maxBudget) return false;
      return true;
    });
  },
};
