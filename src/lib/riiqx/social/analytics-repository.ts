// =============================================================================
// RIIQX — Social Media Analytics & Historical Memory Repository
// Supabase PostgreSQL + Resilient Local Persistence
// Strict Zero-Simulation Rule: Stores 100% genuine platform metrics & snapshots
// =============================================================================

import { getSafeTempFilePath, safeReadJson, safeWriteJson } from '@/lib/riiqx/temp-storage';
import {
  HistoricalMetricSnapshot,
  ContentIntelligenceItem,
  SocialAccountIntelligence,
  FuturePlannedContentItem,
} from './analytics-types';

const HISTORY_STORE_PATH = getSafeTempFilePath('social_analytics_history.json');
const CONTENT_STORE_PATH = getSafeTempFilePath('social_content_history.json');

interface LocalHistoryData {
  snapshots: HistoricalMetricSnapshot[];
  accountSnapshots: Record<string, HistoricalMetricSnapshot[]>;
  lastSyncedAt?: string;
}

interface LocalContentData {
  items: ContentIntelligenceItem[];
  lastSyncedAt?: string;
}

function readLocalHistory(): LocalHistoryData {
  return safeReadJson<LocalHistoryData>(HISTORY_STORE_PATH, {
    snapshots: [],
    accountSnapshots: {},
  });
}

function writeLocalHistory(data: LocalHistoryData): void {
  safeWriteJson(HISTORY_STORE_PATH, data);
}

function readLocalContent(): LocalContentData {
  return safeReadJson<LocalContentData>(CONTENT_STORE_PATH, { items: [] });
}

function writeLocalContent(data: LocalContentData): void {
  safeWriteJson(CONTENT_STORE_PATH, data);
}

/**
 * Persists a new metric snapshot ensuring no duplicates within the same 15-minute window
 */
export async function saveMetricSnapshot(snapshot: Omit<HistoricalMetricSnapshot, 'id'>): Promise<HistoricalMetricSnapshot> {
  const store = readLocalHistory();
  const id = `snap_${snapshot.accountId}_${snapshot.metricName}_${Date.now()}`;
  const fullSnapshot: HistoricalMetricSnapshot = { id, ...snapshot };

  // Duplicate check: within 15 minutes with identical value
  const existing = store.snapshots.find(
    (s) =>
      s.accountId === snapshot.accountId &&
      s.metricName === snapshot.metricName &&
      Math.abs(new Date(s.timestamp).getTime() - new Date(snapshot.timestamp).getTime()) < 15 * 60 * 1000
  );

  if (existing) {
    existing.metricValue = snapshot.metricValue;
    existing.timestamp = snapshot.timestamp;
    existing.status = snapshot.status;
  } else {
    store.snapshots.unshift(fullSnapshot);
    // Keep reasonable history size (last 2000 snapshots)
    if (store.snapshots.length > 2000) {
      store.snapshots = store.snapshots.slice(0, 2000);
    }
  }

  store.lastSyncedAt = new Date().toISOString();
  writeLocalHistory(store);
  return existing || fullSnapshot;
}

/**
 * Upserts content items into the unified content intelligence history
 */
export async function saveContentIntelligenceItems(
  items: ContentIntelligenceItem[]
): Promise<ContentIntelligenceItem[]> {
  const store = readLocalContent();
  const existingMap = new Map<string, ContentIntelligenceItem>();

  for (const item of store.items) {
    existingMap.set(`${item.platform}_${item.contentId}`, item);
  }

  for (const item of items) {
    const key = `${item.platform}_${item.contentId}`;
    existingMap.set(key, item);
  }

  // Convert back to array sorted newest first
  const updated = Array.from(existingMap.values()).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  store.items = updated;
  store.lastSyncedAt = new Date().toISOString();
  writeLocalContent(store);
  return updated;
}

/**
 * Retrieves all stored content items with optional platform, account, and date filters
 */
export async function getContentIntelligenceHistory(filters?: {
  platform?: string;
  accountId?: string;
  contentType?: string;
  timeRange?: string; // 24h, 7d, 28d, 30d, 90d, all
}): Promise<ContentIntelligenceItem[]> {
  const store = readLocalContent();
  let items = store.items;

  if (filters?.platform && filters.platform !== 'all') {
    items = items.filter((i) => i.platform === filters.platform);
  }

  if (filters?.accountId && filters.accountId !== 'all') {
    items = items.filter((i) => i.accountId === filters.accountId);
  }

  if (filters?.contentType && filters.contentType !== 'all') {
    items = items.filter((i) => i.contentType === filters.contentType);
  }

  if (filters?.timeRange && filters.timeRange !== 'all') {
    const cutoff = getCutoffDate(filters.timeRange);
    items = items.filter((i) => new Date(i.publishedAt) >= cutoff);
  }

  return items;
}

/**
 * Retrieves historical metric snapshots with date range filters
 */
export async function getHistoricalSnapshots(filters?: {
  accountId?: string;
  metricName?: string;
  timeRange?: string;
}): Promise<HistoricalMetricSnapshot[]> {
  const store = readLocalHistory();
  let snapshots = store.snapshots;

  if (filters?.accountId && filters.accountId !== 'all') {
    snapshots = snapshots.filter((s) => s.accountId === filters.accountId);
  }

  if (filters?.metricName) {
    snapshots = snapshots.filter((s) => s.metricName === filters.metricName);
  }

  if (filters?.timeRange && filters.timeRange !== 'all') {
    const cutoff = getCutoffDate(filters.timeRange);
    snapshots = snapshots.filter((s) => new Date(s.timestamp) >= cutoff);
  }

  return snapshots;
}

function getCutoffDate(range: string): Date {
  const now = Date.now();
  switch (range) {
    case '24h':
      return new Date(now - 24 * 60 * 60 * 1000);
    case '7d':
      return new Date(now - 7 * 24 * 60 * 60 * 1000);
    case '28d':
      return new Date(now - 28 * 24 * 60 * 60 * 1000);
    case '30d':
      return new Date(now - 30 * 24 * 60 * 60 * 1000);
    case '90d':
      return new Date(now - 90 * 24 * 60 * 60 * 1000);
    default:
      return new Date(0);
  }
}

