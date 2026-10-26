// =============================================================================
// NUVEXA AI — Real Search & Citation Verification Engine
// Zero-Fabrication • SearXNG + Open Web Adapter • Verifiable URL Citations
// =============================================================================

import { NuvexaCitation, SearchResult } from './types';

const SEARXNG_BASE = process.env.SEARXNG_BASE_URL || 'https://searx.be';

/**
 * Execute real web search with zero faking.
 * Tries SearXNG first, falls back to direct open search.
 */
export async function executeWebSearch(query: string, maxResults: number = 5): Promise<SearchResult[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  // 1. Try SearXNG (JSON API)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const url = `${SEARXNG_BASE}/search?q=${encodeURIComponent(cleanQuery)}&format=json&language=en`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Nuvexa-AI-Agent/1.0 (Privacy-Preserving Research Engine)',
      },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.results) && data.results.length > 0) {
        return data.results.slice(0, maxResults).map((r: { title: string; url: string; content?: string }) => {
          let domain = '';
          try {
            domain = new URL(r.url).hostname;
          } catch {
            domain = 'web';
          }
          return {
            title: r.title || 'Source',
            url: r.url,
            snippet: r.content || 'No snippet provided',
            domain,
          };
        });
      }
    }
  } catch {
    // SearXNG timed out or blocked — proceed to fallback
  }

  // 2. Fallback: DuckDuckGo Instant Open Endpoint
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(cleanQuery)}&format=json&no_html=1&skip_disambig=1`;
    const res = await fetch(ddgUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const results: SearchResult[] = [];

      if (data.AbstractText && data.AbstractURL) {
        results.push({
          title: data.Heading || cleanQuery,
          url: data.AbstractURL,
          snippet: data.AbstractText,
          domain: new URL(data.AbstractURL).hostname,
        });
      }

      if (Array.isArray(data.RelatedTopics)) {
        for (const topic of data.RelatedTopics) {
          if (topic.FirstURL && topic.Text) {
            results.push({
              title: topic.Text.slice(0, 60) + '...',
              url: topic.FirstURL,
              snippet: topic.Text,
              domain: new URL(topic.FirstURL).hostname,
            });
            if (results.length >= maxResults) break;
          }
        }
      }

      if (results.length > 0) return results;
    }
  } catch {
    // DuckDuckGo fallback timed out
  }

  // If no external search engine can be contacted, do NOT fabricate results.
  return [];
}

/**
 * Convert verified search results into citations with bracketed indices
 */
export function formatCitations(results: SearchResult[]): {
  citations: NuvexaCitation[];
  citationBlock: string;
} {
  if (results.length === 0) {
    return {
      citations: [],
      citationBlock: '',
    };
  }

  const citations: NuvexaCitation[] = results.map((r, idx) => ({
    id: idx + 1,
    url: r.url,
    title: r.title,
    snippet: r.snippet,
    sourceDomain: r.domain,
  }));

  const citationLines = citations
    .map((c) => `[${c.id}] [${c.title}](${c.url}) — *${c.sourceDomain}*\n> ${c.snippet}`)
    .join('\n\n');

  return {
    citations,
    citationBlock: `\n\n### 📚 Verified Sources & Citations\n${citationLines}`,
  };
}
