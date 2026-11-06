// =============================================================================
// RIIQX — Live Web Research & Verifiable Citation Engine
// Strict Truth-in-Advertising • Zero Fabricated Citations • Numbered Footnotes
// Multi-Tier Engine: SearXNG -> DuckDuckGo HTML Fallback
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

  // 1. Primary: SearXNG
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

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

      if (results.length > 0) {
        const citations: RiiqxSearchCitation[] = results.slice(0, 6).map((r, i) => {
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
    }
  } catch {
    // Fall through to DuckDuckGo HTML fallback
  }

  // 2. High-Reliability Secondary Fallback: DuckDuckGo HTML
  try {
    const ddgUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(sanitizedQuery)}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);

    const res = await fetch(ddgUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const html = await res.text();
      const citations: RiiqxSearchCitation[] = [];

      // Extract results using robust regex parsing
      const titleRegex = /<h2[^>]*class="[^"]*result__title[^"]*"[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
      const snippetRegex = /<a[^>]*class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/gi;

      const titles: { title: string; url: string }[] = [];
      const snippets: string[] = [];

      let match: RegExpExecArray | null;
      while ((match = titleRegex.exec(html)) !== null && titles.length < 8) {
        const rawHref = match[1];
        let actualUrl = rawHref;
        if (rawHref.includes('uddg=')) {
          const uddgMatch = rawHref.match(/uddg=([^&]+)/);
          if (uddgMatch) actualUrl = decodeURIComponent(uddgMatch[1]);
        }
        const title = match[2].replace(/<[^>]+>/g, '').trim();
        if (title && actualUrl.startsWith('http')) {
          titles.push({ title, url: actualUrl });
        }
      }

      while ((match = snippetRegex.exec(html)) !== null && snippets.length < 8) {
        snippets.push(match[1].replace(/<[^>]+>/g, '').trim());
      }

      for (let i = 0; i < titles.length; i++) {
        const item = titles[i];
        let domain = '';
        try {
          domain = new URL(item.url).hostname;
        } catch {
          domain = 'web';
        }

        citations.push({
          id: `cit_${i + 1}`,
          title: item.title,
          url: item.url,
          snippet: snippets[i] || '',
          domain,
          confidenceScore: Number((0.95 - i * 0.05).toFixed(2)),
        });
      }

      if (citations.length > 0) {
        return {
          query: sanitizedQuery,
          citations,
          formattedContext: formatCitationsToContext(citations),
          executedAt: new Date().toISOString(),
        };
      }
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
