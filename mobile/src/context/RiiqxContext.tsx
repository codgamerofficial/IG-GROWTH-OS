// =============================================================================
// RIIQX Master Context & Financial State Provider
// Multi-Asset Holdings • Transaction Ledger • Goal Planning • Offline First
// =============================================================================

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  HoldingItem,
  PortfolioSummary,
  calculatePortfolioSummary,
  convertCurrency,
} from '../services/calculations';

export interface FinancialGoal {
  id: string;
  title: string;
  category: 'emergency_fund' | 'retirement' | 'home_purchase' | 'education' | 'wealth_creation';
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // YYYY-MM-DD
  monthlySip: number;
  expectedReturnPct: number;
  inflationPct: number;
}

export interface TransactionRecord {
  id: string;
  holdingId?: string;
  symbol: string;
  name: string;
  assetClass: HoldingItem['assetClass'];
  type: 'buy' | 'sell' | 'dividend' | 'interest' | 'maturity';
  date: string;
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  currency: 'INR' | 'USD';
  notes?: string;
}

interface RiiqxContextType {
  // User Profile & Settings
  userName: string;
  userEmail: string;
  baseCurrency: 'INR' | 'USD';
  setBaseCurrency: (c: 'INR' | 'USD') => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  riskTolerance: 'conservative' | 'moderate' | 'growth' | 'aggressive';
  setRiskTolerance: (r: 'conservative' | 'moderate' | 'growth' | 'aggressive') => void;

  // Holdings & Portfolio
  holdings: HoldingItem[];
  portfolioSummary: PortfolioSummary;
  addHolding: (holding: Omit<HoldingItem, 'id'>) => void;
  updateHolding: (id: string, updates: Partial<HoldingItem>) => void;
  deleteHolding: (id: string) => void;

  // Transaction Ledger
  transactions: TransactionRecord[];
  addTransaction: (tx: Omit<TransactionRecord, 'id'>) => void;

  // Financial Goals
  goals: FinancialGoal[];
  addGoal: (goal: Omit<FinancialGoal, 'id'>) => void;
  updateGoalAmount: (goalId: string, amount: number) => void;

  // Watchlist
  watchlist: string[];
  toggleWatchlist: (symbol: string) => void;
  isInWatchlist: (symbol: string) => boolean;

  // Data Portability & Privacy
  exportPortfolioAsJson: () => string;
  exportPortfolioAsCsv: () => string;
  importPortfolioFromCsv: (csvText: string) => { success: boolean; importedCount: number; error?: string };
  resetAllUserData: () => Promise<void>;

  // FX Reference
  usdInrRate: number;
  formatMoney: (amount: number, targetCurrency?: 'INR' | 'USD') => string;
  formatCurrency: (amount: number, targetCurrency?: 'INR' | 'USD') => string;
  profile: { fullName: string; email: string };
  summary: PortfolioSummary;
}

const RiiqxContext = createContext<RiiqxContextType | undefined>(undefined);

// Initial Verified Multi-Asset Test Fixtures
const INITIAL_HOLDINGS: HoldingItem[] = [
  {
    id: 'hold_rel',
    name: 'Reliance Industries Ltd',
    symbol: 'RELIANCE',
    assetClass: 'indian_stock',
    quantity: 25,
    averageBuyPrice: 2650.00,
    currentPrice: 2845.50,
    currency: 'INR',
  },
  {
    id: 'hold_tcs',
    name: 'Tata Consultancy Services Ltd',
    symbol: 'TCS',
    assetClass: 'indian_stock',
    quantity: 15,
    averageBuyPrice: 3820.00,
    currentPrice: 4120.00,
    currency: 'INR',
  },
  {
    id: 'hold_ppfas',
    name: 'Parag Parikh Flexi Cap Fund',
    symbol: '122639',
    assetClass: 'mutual_fund',
    quantity: 850.45,
    averageBuyPrice: 62.10,
    currentPrice: 74.82,
    currency: 'INR',
  },
  {
    id: 'hold_nippon',
    name: 'Nippon India Small Cap Fund',
    symbol: '118989',
    assetClass: 'mutual_fund',
    quantity: 320.12,
    averageBuyPrice: 135.50,
    currentPrice: 162.45,
    currency: 'INR',
  },
  {
    id: 'hold_nvda',
    name: 'NVIDIA Corporation',
    symbol: 'NVDA',
    assetClass: 'us_stock',
    quantity: 8,
    averageBuyPrice: 115.00,
    currentPrice: 138.25,
    currency: 'USD',
  },
  {
    id: 'hold_niftybees',
    name: 'Nippon India Nifty 50 BeES ETF',
    symbol: 'NIFTYBEES',
    assetClass: 'etf',
    quantity: 180,
    averageBuyPrice: 248.00,
    currentPrice: 265.40,
    currency: 'INR',
  },
  {
    id: 'hold_gsec',
    name: '7.18% GS 2034 10Y Benchmark Sovereign',
    symbol: 'GS2034',
    assetClass: 'government_bond',
    quantity: 500,
    averageBuyPrice: 99.80,
    currentPrice: 100.45,
    currency: 'INR',
    interestRatePct: 7.18,
    maturityDate: '2034-08-14',
  },
  {
    id: 'hold_embassy',
    name: 'Embassy Office Parks REIT',
    symbol: 'EMBASSY',
    assetClass: 'reit',
    quantity: 100,
    averageBuyPrice: 360.00,
    currentPrice: 388.00,
    currency: 'INR',
  },
  {
    id: 'hold_hdfc_fd',
    name: 'HDFC Bank Term Deposit (3 Year)',
    symbol: 'HDFC_FD_3Y',
    assetClass: 'fixed_deposit',
    quantity: 1,
    averageBuyPrice: 70000.00,
    currentPrice: 70000.00,
    currency: 'INR',
    interestRatePct: 7.30,
    maturityDate: '2027-04-15',
  },
  {
    id: 'hold_gold',
    name: '24K Physical Sovereign Gold (10g)',
    symbol: 'GOLD999',
    assetClass: 'gold',
    quantity: 1,
    averageBuyPrice: 58000.00,
    currentPrice: 65200.00,
    currency: 'INR',
  },
  {
    id: 'hold_btc',
    name: 'Bitcoin (BTC)',
    symbol: 'BTC',
    assetClass: 'crypto',
    quantity: 0.011,
    averageBuyPrice: 51000.00,
    currentPrice: 67452.00,
    currency: 'USD',
  },
];

const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'tx_sbi',
    symbol: 'SBIN',
    name: 'SBI Shares',
    assetClass: 'indian_stock',
    type: 'buy',
    date: '2026-10-24',
    quantity: 15,
    pricePerUnit: 833.33,
    totalAmount: 12500.00,
    currency: 'INR',
  },
  {
    id: 'tx_axis',
    symbol: '120503',
    name: 'Axis Bluechip SIP',
    assetClass: 'mutual_fund',
    type: 'buy',
    date: '2026-10-20',
    quantity: 75.2,
    pricePerUnit: 66.48,
    totalAmount: 5000.00,
    currency: 'INR',
    notes: 'Monthly SIP Auto-Debit',
  },
  {
    id: 'tx_fd_renew',
    symbol: 'HDFC_FD',
    name: 'FD Renewal',
    assetClass: 'fixed_deposit',
    type: 'maturity',
    date: '2026-10-15',
    quantity: 1,
    pricePerUnit: 100000.00,
    totalAmount: 100000.00,
    currency: 'INR',
    notes: 'Compounded Re-investment at 7.30%',
  },
  {
    id: 'tx_1',
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd',
    assetClass: 'indian_stock',
    type: 'buy',
    date: '2026-03-15',
    quantity: 25,
    pricePerUnit: 2650.00,
    totalAmount: 66250.00,
    currency: 'INR',
  },
  {
    id: 'tx_2',
    symbol: '122639',
    name: 'Parag Parikh Flexi Cap Fund',
    assetClass: 'mutual_fund',
    type: 'buy',
    date: '2026-02-10',
    quantity: 850.45,
    pricePerUnit: 62.10,
    totalAmount: 52812.95,
    currency: 'INR',
  },
  {
    id: 'tx_3',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    assetClass: 'us_stock',
    type: 'buy',
    date: '2026-04-05',
    quantity: 8,
    pricePerUnit: 115.00,
    totalAmount: 920.00,
    currency: 'USD',
  },
  {
    id: 'tx_4',
    symbol: 'EMBASSY',
    name: 'Embassy Office Parks REIT',
    assetClass: 'reit',
    type: 'dividend',
    date: '2026-08-20',
    quantity: 100,
    pricePerUnit: 5.60,
    totalAmount: 560.00,
    currency: 'INR',
    notes: 'Q1 Distribution Dividend',
  },
];

const INITIAL_GOALS: FinancialGoal[] = [
  {
    id: 'goal_emergency',
    title: 'Emergency Fund (6 Months Buffer)',
    category: 'emergency_fund',
    targetAmount: 300000,
    currentAmount: 215000,
    targetDate: '2026-12-31',
    monthlySip: 15000,
    expectedReturnPct: 7.2,
    inflationPct: 5.5,
  },
  {
    id: 'goal_retire',
    title: 'Retirement Freedom Corpus',
    category: 'retirement',
    targetAmount: 25000000,
    currentAmount: 1845000,
    targetDate: '2042-01-01',
    monthlySip: 45000,
    expectedReturnPct: 12.0,
    inflationPct: 6.0,
  },
  {
    id: 'goal_home',
    title: 'Home Downpayment Fund',
    category: 'home_purchase',
    targetAmount: 2000000,
    currentAmount: 780000,
    targetDate: '2028-06-30',
    monthlySip: 30000,
    expectedReturnPct: 9.5,
    inflationPct: 5.5,
  },
];

export function RiiqxProvider({ children }: { children: ReactNode }) {
  const [userName] = useState('Arif Hossain');
  const [userEmail] = useState('arif@gmail.com');
  const [baseCurrency, setBaseCurrency] = useState<'INR' | 'USD'>('INR');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [riskTolerance, setRiskTolerance] = useState<'conservative' | 'moderate' | 'growth' | 'aggressive'>('moderate');

  const [holdings, setHoldings] = useState<HoldingItem[]>(INITIAL_HOLDINGS);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);
  const [goals, setGoals] = useState<FinancialGoal[]>(INITIAL_GOALS);
  const [watchlist, setWatchlist] = useState<string[]>(['RELIANCE', '122639', 'NVDA', 'GOLD999']);

  const usdInrRate = 84.20;

  // Load persisted state on startup
  useEffect(() => {
    (async () => {
      try {
        const savedHoldings = await AsyncStorage.getItem('@riiqx_holdings');
        if (savedHoldings) setHoldings(JSON.parse(savedHoldings));

        const savedTx = await AsyncStorage.getItem('@riiqx_transactions');
        if (savedTx) setTransactions(JSON.parse(savedTx));

        const savedGoals = await AsyncStorage.getItem('@riiqx_goals');
        if (savedGoals) setGoals(JSON.parse(savedGoals));

        const savedCurrency = await AsyncStorage.getItem('@riiqx_currency');
        if (savedCurrency === 'USD' || savedCurrency === 'INR') setBaseCurrency(savedCurrency);

        const savedTheme = await AsyncStorage.getItem('@riiqx_theme');
        if (savedTheme) setIsDarkMode(savedTheme === 'dark');
      } catch {
        // Fall back to memory defaults
      }
    })();
  }, []);

  // Save changes
  const persistHoldings = async (next: HoldingItem[]) => {
    setHoldings(next);
    await AsyncStorage.setItem('@riiqx_holdings', JSON.stringify(next));
  };

  const persistTransactions = async (next: TransactionRecord[]) => {
    setTransactions(next);
    await AsyncStorage.setItem('@riiqx_transactions', JSON.stringify(next));
  };

  const persistGoals = async (next: FinancialGoal[]) => {
    setGoals(next);
    await AsyncStorage.setItem('@riiqx_goals', JSON.stringify(next));
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      AsyncStorage.setItem('@riiqx_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  // Portfolio Summary Memo
  const portfolioSummary = useMemo(() => {
    return calculatePortfolioSummary(holdings, usdInrRate);
  }, [holdings, usdInrRate]);

  // Holding operations
  const addHolding = (holdingData: Omit<HoldingItem, 'id'>) => {
    const newHolding: HoldingItem = {
      ...holdingData,
      id: `hold_${Date.now()}`,
    };
    const nextHoldings = [newHolding, ...holdings];
    persistHoldings(nextHoldings);

    // Auto-record initial buy transaction
    const newTx: TransactionRecord = {
      id: `tx_${Date.now()}`,
      holdingId: newHolding.id,
      symbol: newHolding.symbol,
      name: newHolding.name,
      assetClass: newHolding.assetClass,
      type: 'buy',
      date: new Date().toISOString().split('T')[0],
      quantity: newHolding.quantity,
      pricePerUnit: newHolding.averageBuyPrice,
      totalAmount: Math.round(newHolding.quantity * newHolding.averageBuyPrice),
      currency: newHolding.currency,
      notes: 'Initial holding entry',
    };
    persistTransactions([newTx, ...transactions]);
  };

  const updateHolding = (id: string, updates: Partial<HoldingItem>) => {
    const next = holdings.map((h) => (h.id === id ? { ...h, ...updates } : h));
    persistHoldings(next);
  };

  const deleteHolding = (id: string) => {
    const next = holdings.filter((h) => h.id !== id);
    persistHoldings(next);
  };

  // Transaction operations
  const addTransaction = (txData: Omit<TransactionRecord, 'id'>) => {
    const newTx: TransactionRecord = {
      ...txData,
      id: `tx_${Date.now()}`,
    };
    persistTransactions([newTx, ...transactions]);
  };

  // Goals operations
  const addGoal = (goalData: Omit<FinancialGoal, 'id'>) => {
    const newGoal: FinancialGoal = {
      ...goalData,
      id: `goal_${Date.now()}`,
    };
    persistGoals([...goals, newGoal]);
  };

  const updateGoalAmount = (goalId: string, amount: number) => {
    const next = goals.map((g) => (g.id === goalId ? { ...g, currentAmount: amount } : g));
    persistGoals(next);
  };

  // Watchlist
  const toggleWatchlist = (symbol: string) => {
    setWatchlist((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  const isInWatchlist = (symbol: string) => watchlist.includes(symbol);

  // Formatting Helper
  const formatMoney = (amount: number, targetCurrency = baseCurrency) => {
    const converted = convertCurrency(amount, 'INR', targetCurrency, usdInrRate);
    if (targetCurrency === 'INR') {
      return `₹${Math.round(converted).toLocaleString('en-IN')}`;
    }
    return `$${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Export JSON
  const exportPortfolioAsJson = () => {
    const payload = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      user: { name: userName, email: userEmail, baseCurrency },
      summary: portfolioSummary,
      holdings,
      transactions,
      goals,
    };
    return JSON.stringify(payload, null, 2);
  };

  // Export CSV
  const exportPortfolioAsCsv = () => {
    const headers = ['Symbol', 'Name', 'Asset Class', 'Quantity', 'Avg Buy Price', 'Current Price', 'Currency', 'Invested Amount', 'Current Value'];
    const rows = holdings.map((h) => [
      h.symbol,
      `"${h.name}"`,
      h.assetClass,
      h.quantity,
      h.averageBuyPrice,
      h.currentPrice,
      h.currency,
      (h.quantity * h.averageBuyPrice).toFixed(2),
      (h.quantity * h.currentPrice).toFixed(2),
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  };

  // Import CSV
  const importPortfolioFromCsv = (csvText: string) => {
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) return { success: false, importedCount: 0, error: 'CSV file contains no records' };

      const newHoldings: HoldingItem[] = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');
        if (parts.length >= 6) {
          const symbol = parts[0].trim();
          const name = parts[1].replace(/"/g, '').trim();
          const assetClass = parts[2].trim() as HoldingItem['assetClass'];
          const quantity = parseFloat(parts[3]) || 0;
          const averageBuyPrice = parseFloat(parts[4]) || 0;
          const currentPrice = parseFloat(parts[5]) || averageBuyPrice;
          const currency = (parts[6]?.trim().toUpperCase() === 'USD' ? 'USD' : 'INR') as 'INR' | 'USD';

          if (symbol && quantity > 0) {
            newHoldings.push({
              id: `imp_${Date.now()}_${i}`,
              symbol,
              name: name || symbol,
              assetClass: assetClass || 'indian_stock',
              quantity,
              averageBuyPrice,
              currentPrice,
              currency,
            });
          }
        }
      }

      if (newHoldings.length === 0) {
        return { success: false, importedCount: 0, error: 'No valid holding records found in CSV' };
      }

      const merged = [...newHoldings, ...holdings];
      persistHoldings(merged);
      return { success: true, importedCount: newHoldings.length };
    } catch (err: any) {
      return { success: false, importedCount: 0, error: err.message || 'Failed to parse CSV' };
    }
  };

  // Delete all user data (GDPR / Right to be forgotten compliant)
  const resetAllUserData = async () => {
    await AsyncStorage.clear();
    setHoldings([]);
    setTransactions([]);
    setGoals([]);
    setWatchlist([]);
  };

  return (
    <RiiqxContext.Provider
      value={{
        userName,
        userEmail,
        baseCurrency,
        setBaseCurrency,
        isDarkMode,
        toggleDarkMode,
        riskTolerance,
        setRiskTolerance,
        holdings,
        portfolioSummary,
        addHolding,
        updateHolding,
        deleteHolding,
        transactions,
        addTransaction,
        goals,
        addGoal,
        updateGoalAmount,
        watchlist,
        toggleWatchlist,
        isInWatchlist,
        exportPortfolioAsJson,
        exportPortfolioAsCsv,
        importPortfolioFromCsv,
        resetAllUserData,
        usdInrRate,
        formatMoney,
        formatCurrency: formatMoney,
        profile: { fullName: userName, email: userEmail },
        summary: portfolioSummary,
      }}
    >
      {children}
    </RiiqxContext.Provider>
  );
}

export function useRiiqx() {
  const context = useContext(RiiqxContext);
  if (!context) {
    throw new Error('useRiiqx must be used within a RiiqxProvider');
  }
  return context;
}
