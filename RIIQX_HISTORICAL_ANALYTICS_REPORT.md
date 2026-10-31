# RIIQX — Historical Analytics Report
## Metric Snapshot Engine • Time-Series Retention • Zero Overwriting • Date Range Queries

---

### 1. Historical Memory Engine Architecture

A foundational rule of RIIQX is that **old metrics are never overwritten with new values**. Instead, discrete time-stamped snapshots are accumulated to track growth velocity, subscriber shifts, and view trajectories over time.

```typescript
export interface HistoricalMetricSnapshot {
  id: string;               // snap_accountId_metricName_timestamp
  accountId: string;        // Target channel ID
  platform: string;         // 'youtube' | 'instagram'
  metricName: string;       // 'subscribers' | 'followers' | 'total_views' | 'likes'
  metricValue: number;      // Exact numeric reading
  unit?: string;            // 'count' | '%'
  timestamp: string;        // ISO 8601 recording time
  reportingPeriod: string;  // 'lifetime' | '28d' | 'recent_uploads'
  sourceApi: string;        // Provenance API endpoint
  status: AnalyticsDataStatus; // 'VERIFIED' | 'CACHED'
}
```

---

### 2. Snapshot Ingestion Safeguards

To prevent storage bloating from rapid page refreshes:
1. **15-Minute Idempotency Guard:**
   - If a snapshot for the same `accountId` and `metricName` exists within a 15-minute window with the same value, the timestamp is refreshed without creating a duplicate record.
2. **Value-Change Sensitivity:**
   - If the metric changes (e.g., subscriber count jumps from 2,900 to 2,901), a new snapshot is created immediately regardless of the time elapsed.
3. **Capacity Management:**
   - The local store retains the most recent 2,000 discrete snapshots in FIFO order, ensuring lightweight file I/O ($< 150\text{KB}$).

---

### 3. Date Range Query Performance

The repository supports 5 standardized reporting horizons:
- `24h`: Hourly trend analysis.
- `7d`: Weekly cadence and immediate release performance.
- `28d`: Standard Meta and YouTube monthly cycle.
- `30d`: Standard calendar monthly comparison.
- `90d`: Quarterly growth trajectory.
- `all`: Full channel history since connection.

---

### 4. Mathematical Trend Projection from Stored Snapshots

When 3 or more snapshots exist across separate days, the engine fits a linear regression model ($y = mx + b$) to evaluate average daily subscriber or follower velocity:

$$\text{Slope } m = \frac{n\sum (xy) - \sum x \sum y}{n\sum (x^2) - (\sum x)^2}$$

This mathematical trend serves as the strictly verified basis for 30-day forecasting, completely avoiding simulated numbers.

