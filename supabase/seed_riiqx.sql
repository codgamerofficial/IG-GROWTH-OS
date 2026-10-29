-- =============================================================================
-- RIIQX — Master Seed Fixtures for Development & Offline-Resilient Testing
-- Real Indian Equities, MFAPI Mutual Funds, US Stocks, ETFs, RBI Bonds, FDs & Bullion
-- =============================================================================

-- 1. Insert Data Sources
INSERT INTO public.market_data_sources (id, name, tier, daily_call_limit, calls_used_today, is_active, status_message)
VALUES 
  ('mfapi', 'MFAPI.in Public API', 'free', 10000, 42, true, 'Healthy · Daily updated historical NAVs'),
  ('tapetide', 'Tapetide Indian Market Gateway', 'free', 50, 6, true, 'Healthy · Rate-limited to 50 calls/day'),
  ('alphavantage', 'Alpha Vantage Global API', 'free', 25, 4, true, 'Healthy · US equities and commodities'),
  ('rbi_retail', 'RBI Retail Direct Sovereign Catalog', 'official', 5000, 10, true, 'Healthy · Verified sovereign coupon rates'),
  ('institutional_fd', 'Indian Banks Published Term Deposit Rates', 'curated', 1000, 15, true, 'Healthy · DICGC insured up to ₹5 Lakh')
ON CONFLICT (id) DO UPDATE SET is_active = EXCLUDED.is_active;

-- 2. Insert Core Instruments Catalog
INSERT INTO public.instruments (id, symbol, name, asset_class, exchange, country, currency, expense_ratio, pe_ratio, pb_ratio, dividend_yield, market_cap_category, risk_rating, is_tradeable)
VALUES
  -- Indian Stocks
  ('11111111-1111-1111-1111-111111110001', 'RELIANCE', 'Reliance Industries Ltd', 'indian_stock', 'NSE', 'IN', 'INR', NULL, 26.80, 2.30, 0.0035, 'large_cap', 'moderate', true),
  ('11111111-1111-1111-1111-111111110002', 'TCS', 'Tata Consultancy Services Ltd', 'indian_stock', 'NSE', 'IN', 'INR', NULL, 30.15, 12.80, 0.0125, 'large_cap', 'moderate', true),
  ('11111111-1111-1111-1111-111111110003', 'HDFCBANK', 'HDFC Bank Ltd', 'indian_stock', 'NSE', 'IN', 'INR', NULL, 18.50, 2.75, 0.0110, 'large_cap', 'moderate', true),
  ('11111111-1111-1111-1111-111111110004', 'INFY', 'Infosys Ltd', 'indian_stock', 'NSE', 'IN', 'INR', NULL, 28.40, 7.90, 0.0210, 'large_cap', 'moderate', true),
  ('11111111-1111-1111-1111-111111110005', 'TATAMOTORS', 'Tata Motors Passenger Vehicles Ltd', 'indian_stock', 'NSE', 'IN', 'INR', NULL, 16.20, 3.40, 0.0060, 'large_cap', 'moderately_high', true),

  -- Mutual Funds (MFAPI Code Linked)
  ('22222222-2222-2222-2222-222222220001', '122639', 'Parag Parikh Flexi Cap Fund - Direct Plan - Growth', 'mutual_fund', 'MF', 'IN', 'INR', 0.0061, NULL, NULL, NULL, 'large_cap', 'moderately_high', true),
  ('22222222-2222-2222-2222-222222220002', '118989', 'Nippon India Small Cap Fund - Direct Plan - Growth', 'mutual_fund', 'MF', 'IN', 'INR', 0.0067, NULL, NULL, NULL, 'small_cap', 'very_high', true),
  ('22222222-2222-2222-2222-222222220003', '118834', 'Mirae Asset Large Cap Fund - Direct Plan - Growth', 'mutual_fund', 'MF', 'IN', 'INR', 0.0055, NULL, NULL, NULL, 'large_cap', 'moderate', true),

  -- US Stocks
  ('33333333-3333-3333-3333-333333330001', 'NVDA', 'NVIDIA Corporation', 'us_stock', 'NASDAQ', 'US', 'USD', NULL, 48.20, 38.50, 0.0003, 'large_cap', 'high', true),
  ('33333333-3333-3333-3333-333333330002', 'AAPL', 'Apple Inc', 'us_stock', 'NASDAQ', 'US', 'USD', NULL, 33.40, 48.10, 0.0045, 'large_cap', 'moderate', true),
  ('33333333-3333-3333-3333-333333330003', 'MSFT', 'Microsoft Corporation', 'us_stock', 'NASDAQ', 'US', 'USD', NULL, 34.60, 11.80, 0.0072, 'large_cap', 'moderate', true),

  -- ETFs
  ('44444444-4444-4444-4444-444444440001', 'NIFTYBEES', 'Nippon India Nifty 50 BeES ETF', 'etf', 'NSE', 'IN', 'INR', 0.0004, 23.40, 3.80, 0.0120, 'large_cap', 'moderate', true),
  ('44444444-4444-4444-4444-444444440002', 'GOLDBEES', 'Nippon India Gold ETF BeES', 'etf', 'NSE', 'IN', 'INR', 0.0052, NULL, NULL, NULL, 'sovereign', 'low_to_moderate', true),
  ('44444444-4444-4444-4444-444444440003', 'MON100', 'Motilal Oswal Nasdaq 100 ETF', 'etf', 'NSE', 'IN', 'INR', 0.0058, 32.10, 8.40, 0.0030, 'large_cap', 'moderately_high', true),

  -- Government & Corporate Bonds
  ('55555555-5555-5555-5555-555555550001', 'GS2034', '7.18% GS 2034 10-Year Benchmark GoI Bond', 'government_bond', 'RBI', 'IN', 'INR', NULL, NULL, NULL, 0.0718, 'sovereign', 'low', true),
  ('55555555-5555-5555-5555-555555550002', 'FRSB2031', 'RBI Floating Rate Savings Bonds 2020 (Taxable)', 'government_bond', 'RBI', 'IN', 'INR', NULL, NULL, NULL, 0.0805, 'sovereign', 'low', false),
  ('55555555-5555-5555-5555-555555550003', 'HDFCBOND28', 'HDFC Ltd 7.95% AAA Corporate Debenture 2028', 'corporate_bond', 'BSE', 'IN', 'INR', NULL, NULL, NULL, 0.0795, 'banking', 'low_to_moderate', true),

  -- REITs & InvITs
  ('66666666-6666-6666-6666-666666660001', 'EMBASSY', 'Embassy Office Parks REIT', 'reit', 'NSE', 'IN', 'INR', NULL, 24.50, 1.15, 0.0680, 'large_cap', 'moderate', true),
  ('66666666-6666-6666-6666-666666660002', 'NEXUS', 'Nexus Select Trust Retail REIT', 'reit', 'NSE', 'IN', 'INR', NULL, 21.00, 1.05, 0.0720, 'large_cap', 'moderate', true),

  -- Fixed Deposits (Bank / Post Office)
  ('77777777-7777-7777-7777-777777770001', 'HDFC_FD_3Y', 'HDFC Bank Regular Term Deposit (3 Year)', 'fixed_deposit', 'BANK', 'IN', 'INR', NULL, NULL, NULL, 0.0730, 'banking', 'low', false),
  ('77777777-7777-7777-7777-777777770002', 'SBI_WECARE_5Y', 'SBI Special 5-Year Term Deposit', 'fixed_deposit', 'BANK', 'IN', 'INR', NULL, NULL, NULL, 0.0710, 'banking', 'low', false),
  ('77777777-7777-7777-7777-777777770003', 'BAJAJ_FD_2Y', 'Bajaj Finance AAA Fixed Deposit (2 Year Cumulative)', 'fixed_deposit', 'NBFC', 'IN', 'INR', NULL, NULL, NULL, 0.0810, 'banking', 'low_to_moderate', false),

  -- Physical Bullion & Commodities
  ('88888888-8888-8888-8888-888888880001', 'GOLD999', '24K Physical Gold Bullion (99.9% Purity)', 'gold', 'MCX', 'IN', 'INR', NULL, NULL, NULL, NULL, 'sovereign', 'moderate', true),
  ('88888888-8888-8888-8888-888888880002', 'SILVER999', 'Physical Fine Silver (99.9% Purity)', 'silver', 'MCX', 'IN', 'INR', NULL, NULL, NULL, NULL, 'sovereign', 'moderately_high', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Link Instrument Identifiers
INSERT INTO public.instrument_identifiers (instrument_id, identifier_type, identifier_value)
VALUES
  ('11111111-1111-1111-1111-111111110001', 'isin', 'INE002A01018'),
  ('11111111-1111-1111-1111-111111110001', 'nse_symbol', 'RELIANCE'),
  ('11111111-1111-1111-1111-111111110002', 'isin', 'INE467B01029'),
  ('11111111-1111-1111-1111-111111110002', 'nse_symbol', 'TCS'),
  ('11111111-1111-1111-1111-111111110003', 'isin', 'INE040A01034'),
  ('11111111-1111-1111-1111-111111110003', 'nse_symbol', 'HDFCBANK'),
  ('22222222-2222-2222-2222-222222220001', 'mfapi_code', '122639'),
  ('22222222-2222-2222-2222-222222220001', 'isin', 'INF879O01015'),
  ('22222222-2222-2222-2222-222222220002', 'mfapi_code', '118989'),
  ('22222222-2222-2222-2222-222222220002', 'isin', 'INF204K01844'),
  ('33333333-3333-3333-3333-333333330001', 'ticker', 'NVDA'),
  ('33333333-3333-3333-3333-333333330002', 'ticker', 'AAPL')
ON CONFLICT (identifier_type, identifier_value) DO NOTHING;

-- 4. Initial Verified Market Data Points
INSERT INTO public.market_data_points (instrument_id, data_timestamp, price, currency, source_id, is_delayed, day_change_pct)
VALUES
  ('11111111-1111-1111-1111-111111110001', NOW(), 2845.50, 'INR', 'tapetide', false, 1.25),
  ('11111111-1111-1111-1111-111111110002', NOW(), 4120.00, 'INR', 'tapetide', false, -0.45),
  ('11111111-1111-1111-1111-111111110003', NOW(), 1682.25, 'INR', 'tapetide', false, 0.85),
  ('22222222-2222-2222-2222-222222220001', NOW(), 74.82, 'INR', 'mfapi', false, 0.62),
  ('22222222-2222-2222-2222-222222220002', NOW(), 162.45, 'INR', 'mfapi', false, 1.84),
  ('33333333-3333-3333-3333-333333330001', NOW(), 138.25, 'USD', 'alphavantage', true, 2.15),
  ('33333333-3333-3333-3333-333333330002', NOW(), 231.50, 'USD', 'alphavantage', true, 0.40),
  ('44444444-4444-4444-4444-444444440001', NOW(), 265.40, 'INR', 'tapetide', false, 0.55),
  ('44444444-4444-4444-4444-444444440002', NOW(), 68.90, 'INR', 'tapetide', false, -0.15),
  ('55555555-5555-5555-5555-555555550001', NOW(), 100.45, 'INR', 'rbi_retail', false, 0.05),
  ('66666666-6666-6666-6666-666666660001', NOW(), 388.00, 'INR', 'tapetide', false, 0.35),
  ('77777777-7777-7777-7777-777777770001', NOW(), 100000.00, 'INR', 'institutional_fd', false, 0.00),
  ('88888888-8888-8888-8888-888888880001', NOW(), 7950.00, 'INR', 'alphavantage', false, 0.80),
  ('88888888-8888-8888-8888-888888880002', NOW(), 98.50, 'INR', 'alphavantage', false, 1.10)
ON CONFLICT (instrument_id, data_timestamp) DO NOTHING;
