# RIIQX — Analytics Data Integrity Report
## Strict Authenticity Protocol • Zero-Simulation Rule • Provenance Metadata Specification

---

### 1. The Strict Data Authenticity Protocol

```
ANALYTICS_DATA_INTEGRITY = STRICT
ZERO_SIMULATION_RULE = ENFORCED
PROVENANCE_TRACKING = MANDATORY
```

Under this protocol, every number rendered on screen must carry verifiable cryptographic or API provenance.

---

### 2. Mandatory Provenance Metadata

Every single metric rendered across RIIQX must satisfy the following contract:

```typescript
export interface ProvenanceMetric {
  name: string;               // Normalized machine key: 'subscribers', 'views', 'followers'
  displayName: string;        // Human label: 'Subscribers'
  value: number | null;       // Authentic numeric value, or null if unretrievable
  unit?: string;              // 'count', '%', 'seconds'
  status: AnalyticsDataStatus; // Allowed status from 10-state taxonomy
  statusExplanation?: string; // Clear description when permission or auth is required
  sourceApi: string;          // Origin endpoint: 'YouTube Data API v3 /channels'
  reportingPeriod: string;    // 'lifetime', '28d', 'recent_uploads'
  lastSyncedAt: string;       // ISO 8601 synchronization timestamp
}
```

---

### 3. Allowed 10-State Provenance Taxonomy

1. **`VERIFIED`**: Directly retrieved and authenticated from an active platform API session within the current synchronization run.
2. **`CACHED`**: Retrieved from a verified prior synchronization run within the historical snapshot repository, displaying exact `lastSyncedAt`.
3. **`PARTIAL`**: Contains valid telemetry for a subset of components, with missing dimensions explicitly identified.
4. **`DELAYED`**: The platform API has a documented reporting lag (e.g., YouTube views updating with a 24-48 hour delay).
5. **`UNAVAILABLE`**: The platform does not support this metric for the connected account tier or account has no data.
6. **`PERMISSION_MISSING`**: The user has not granted the specific OAuth scope required (e.g. `instagram_manage_insights`).
7. **`AUTHENTICATION_REQUIRED`**: OAuth access token has expired and requires manual re-authorization or valid refresh token.
8. **`RATE_LIMITED`**: The platform has returned HTTP 429; backoff is in effect.
9. **`API_ERROR`**: Platform API service outage or internal endpoint error.
10. **`FORECAST`**: A mathematical projection clearly separated from actual recorded metrics.

---

### 4. Zero-Tolerance Invariants Verified by Automated Tests

- **Zero `Math.random()`:** No random number generation exists in analytics routes, synchronization engines, or growth models.
- **Zero Hardcoded Benchmarks:** The illustrative `78%` pattern benchmark and fake retention drop-off percentages were permanently removed.
- **Zero Mock Fallbacks:** In the event of an API error, the system outputs `API_ERROR` or `AUTHENTICATION_REQUIRED` rather than falling back to demo fixture numbers.
- **Zero Fabricated Forecasts:** Performance forecasting strictly refuses to extrapolate trends when fewer than 3 snapshot data points exist.

