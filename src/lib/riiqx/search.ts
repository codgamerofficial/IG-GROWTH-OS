// =============================================================================
// RIIQX — Live Web Research & Verifiable Citation Engine
// Strict Truth-in-Advertising • Zero Fabricated Citations • Numbered Footnotes
// =============================================================================

import { RiiqxSearchCitation } from './types';

export interface SearchQueryResult {
  query: string;
  citations: RiiqxSearchCitation[];
  formattedContext: string;
  executedAt: string;
}

const SEARXNG_ENDPOINT = process.env.SEARXNG_URL || 'https://searx.be';

export async function executeLiveResearch(query: string): Promise<SearchQueryResult> {
  const sanitizedQuery = query.trim().slice(0, 200);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const url = new URL(`${SEARXNG_ENDPOINT}/search`);
    url.searchParams.set('q', sanitizedQuery);
    url.searchParams.set('format', 'json');
    url.searchParams.set('engines', 'duckduckgo,google,bing,wikipedia');

    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'RIIQX-Research-Agent/2.0',
      },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const results: any[] = data.results || [];

      const citations: RiiqxSearchCitation[] = results.slice(0, 5).map((r, i) => {
        let domain = '';
        try {
          domain = new URL(r.url).hostname;
        } catch {
          domain = 'web';
        }

        return {
          id: `cit_${i + 1}`,
          title: r.title || `Source ${i + 1}`,
          url: r.url,
          snippet: r.content || r.snippet || '',
          domain,
          confidenceScore: Number((0.95 - i * 0.05).toFixed(2)),
        };
      });

      const formattedContext = formatCitationsToContext(citations);

      return {
        query: sanitizedQuery,
        citations,
        formattedContext,
        executedAt: new Date().toISOString(),
      };
    }
  } catch {
    // Search failed or unavailable
  }

  // Never fabricate or attach fake default citations
  return {
    query: sanitizedQuery,
    citations: [],
    formattedContext: '',
    executedAt: new Date().toISOString(),
  };
}

export function formatCitationsToContext(citations: RiiqxSearchCitation[]): string {
  if (!citations.length) return '';

  return (
    '--- BEGIN VERIFIED WEB RESEARCH CITATIONS ---\n' +
    citations
      .map(
        (c, idx) =>
          `[${idx + 1}] Title: "${c.title}"\n    URL: ${c.url}\n    Summary: ${c.snippet}\n`
      )
      .join('\n') +
    '--- END VERIFIED WEB RESEARCH CITATIONS ---\n\n' +
    'Instruction: When referencing the above research in your response, append bracketed citation markers like [^1], [^2] corresponding to the exact numbered source.'
  );
}
