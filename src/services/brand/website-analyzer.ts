// =============================================================================
// RIIQX — Master SSRF-Safe Website Scraper & Visual Identity Extractor
// Strict IP Filter • Private Network Protection • Metadata & Color Decomposition
// =============================================================================

import dns from 'node:dns/promises';
import { WebsiteAnalysisResult, ExtractedColor } from './types';

export class WebsiteAnalyzer {
  private static MAX_REDIRECTS = 3;
  private static TIMEOUT_MS = 10_000;
  private static MAX_BODY_BYTES = 5 * 1024 * 1024; // 5 MB

  /**
   * Validate URL against SSRF attacks (private networks, localhost, cloud metadata)
   */
  public static async validateUrlSafe(inputUrl: string): Promise<URL> {
    let parsed: URL;
    try {
      parsed = new URL(inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`);
    } catch {
      throw new Error(`Invalid URL format: "${inputUrl}"`);
    }

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new Error(`Unsupported protocol: "${parsed.protocol}". Only HTTP and HTTPS are permitted.`);
    }

    const hostname = parsed.hostname.toLowerCase();

    // 1. Direct Blocked Hostnames
    const blockedHostnames = [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      '::1',
      'metadata.google.internal',
      'instance-data',
    ];

    if (
      blockedHostnames.includes(hostname) ||
      hostname.endsWith('.localhost') ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal')
    ) {
      throw new Error(`SSRF Block: Hostname '${hostname}' points to a protected or loopback network.`);
    }

    // 2. DNS Resolution & Private IP Range Validation
    try {
      const lookup = await dns.lookup(hostname, { all: true });
      for (const record of lookup) {
        if (this.isPrivateOrRestrictedIp(record.address)) {
          throw new Error(`SSRF Block: Resolved IP address '${record.address}' is within a private/restricted subnet.`);
        }
      }
    } catch (err: any) {
      if (err.message.includes('SSRF Block')) throw err;
      throw new Error(`Unable to resolve hostname '${hostname}': ${err.message}`);
    }

    return parsed;
  }

  /**
   * Safely fetch and analyze a target website
   */
  public static async analyzeWebsite(targetUrl: string): Promise<WebsiteAnalysisResult> {
    const validatedUrl = await this.validateUrlSafe(targetUrl);
    const domain = validatedUrl.hostname;

    // Fetch with timeout and size limit
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

    let html = '';
    try {
      const response = await fetch(validatedUrl.toString(), {
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 (RIIQX Brand Intelligence Scraper)',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        redirect: 'follow',
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Website responded with HTTP ${response.status}: ${response.statusText}`);
      }

      // Final redirect URL SSRF verification
      if (response.url) {
        await this.validateUrlSafe(response.url);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        html = await response.text();
      } else {
        const chunks: Uint8Array[] = [];
        let bytesReceived = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            bytesReceived += value.length;
            if (bytesReceived > this.MAX_BODY_BYTES) {
              reader.cancel();
              throw new Error(`Response exceeded maximum permitted size of 5 MB.`);
            }
            chunks.push(value);
          }
        }

        const fullBuffer = Buffer.concat(chunks);
        html = fullBuffer.toString('utf-8');
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error(`Request timed out after ${this.TIMEOUT_MS}ms.`);
      }
      throw err;
    }

    return this.parseHtmlIntelligence(html, validatedUrl);
  }

  /**
   * Parse HTML contents into structured Brand Intelligence
   */
  public static parseHtmlIntelligence(html: string, url: URL): WebsiteAnalysisResult {
    const domain = url.hostname;

    // 1. Title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
    const title = (ogTitleMatch?.[1] || titleMatch?.[1] || '').trim();

    // 2. Description
    const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
    const description = (ogDescMatch?.[1] || metaDescMatch?.[1] || '').trim();

    // 3. Keywords
    const metaKeywordsMatch = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["']/i);
    const keywords = metaKeywordsMatch?.[1]
      ? metaKeywordsMatch[1].split(',').map((k) => k.trim()).filter(Boolean)
      : [];

    // 4. Color Palette Extraction (Theme color + CSS hexes)
    const colorMap = new Map<string, ExtractedColor>();

    const themeColorMatch = html.match(/<meta[^>]*name=["']theme-color["'][^>]*content=["']([^"']+)["']/i);
    if (themeColorMatch?.[1] && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(themeColorMatch[1])) {
      const hex = this.normalizeHex(themeColorMatch[1]);
      colorMap.set(hex, { hex, source: 'meta_theme', frequency: 10 });
    }

    // Extract hex codes from style tags and inline styles
    const hexRegex = /#([0-9a-fA-F]{6})\b/g;
    let match: RegExpExecArray | null;
    while ((match = hexRegex.exec(html)) !== null) {
      const hex = match[0].toUpperCase();
      // Ignore common pure white/black fallbacks in frequency counts
      if (hex !== '#FFFFFF' && hex !== '#000000') {
        const existing = colorMap.get(hex);
        if (existing) {
          existing.frequency += 1;
        } else {
          colorMap.set(hex, { hex, source: 'inline_style', frequency: 1 });
        }
      }
    }

    const sortedColors = Array.from(colorMap.values())
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 8);

    // 5. Typography Clues
    const fontFamilies = new Set<string>();
    const fontRegex = /font-family\s*:\s*([^;}"']+)/gi;
    let fontMatch: RegExpExecArray | null;
    while ((fontMatch = fontRegex.exec(html)) !== null) {
      const cleaned = fontMatch[1]
        .split(',')[0]
        .replace(/['"]/g, '')
        .trim();
      if (cleaned && !['inherit', 'initial', 'sans-serif', 'serif', 'monospace'].includes(cleaned.toLowerCase())) {
        fontFamilies.add(cleaned);
      }
    }

    // 6. Logos and Brand Assets
    const logoUrls: string[] = [];
    const iconMatch = html.match(/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["']/i);
    if (iconMatch?.[1]) {
      logoUrls.push(this.resolveRelativeUrl(iconMatch[1], url));
    }
    const appleIconMatch = html.match(/<link[^>]*rel=["']apple-touch-icon["'][^>]*href=["']([^"']+)["']/i);
    if (appleIconMatch?.[1]) {
      logoUrls.push(this.resolveRelativeUrl(appleIconMatch[1], url));
    }

    const imgRegex = /<img[^>]*src=["']([^"']+)["'][^>]*>/gi;
    let imgMatch: RegExpExecArray | null;
    while ((imgMatch = imgRegex.exec(html)) !== null) {
      const tag = imgMatch[0].toLowerCase();
      const src = imgMatch[1];
      if (tag.includes('logo') || tag.includes('brand') || src.toLowerCase().includes('logo')) {
        const resolved = this.resolveRelativeUrl(src, url);
        if (!logoUrls.includes(resolved)) {
          logoUrls.push(resolved);
        }
      }
    }

    // 7. Headings
    const headings: string[] = [];
    const hRegex = /<h[1-2][^>]*>([\s\S]*?)<\/h[1-2]>/gi;
    let hMatch: RegExpExecArray | null;
    while ((hMatch = hRegex.exec(html)) !== null && headings.length < 8) {
      const text = hMatch[1].replace(/<[^>]*>/g, '').trim();
      if (text && text.length > 3 && text.length < 120) {
        headings.push(text);
      }
    }

    // 8. CTAs
    const ctas: string[] = [];
    const ctaRegex = /<(?:button|a)[^>]*(?:class|id)=["'][^"']*(?:btn|cta|action|primary)[^"']*["'][^>]*>([\s\S]*?)<\/(?:button|a)>/gi;
    let ctaMatch: RegExpExecArray | null;
    while ((ctaMatch = ctaRegex.exec(html)) !== null && ctas.length < 6) {
      const text = ctaMatch[1].replace(/<[^>]*>/g, '').trim();
      if (text && text.length > 2 && text.length < 40) {
        ctas.push(text);
      }
    }

    // 9. Social Links
    const socialLinks: WebsiteAnalysisResult['socialLinks'] = {};
    if (html.includes('twitter.com/') || html.includes('x.com/')) {
      const m = html.match(/href=["'](https?:\/\/(?:twitter|x)\.com\/[^"'\s]+)["']/i);
      if (m?.[1]) socialLinks.twitter = m[1];
    }
    if (html.includes('instagram.com/')) {
      const m = html.match(/href=["'](https?:\/\/instagram\.com\/[^"'\s]+)["']/i);
      if (m?.[1]) socialLinks.instagram = m[1];
    }
    if (html.includes('youtube.com/')) {
      const m = html.match(/href=["'](https?:\/\/youtube\.com\/[^"'\s]+)["']/i);
      if (m?.[1]) socialLinks.youtube = m[1];
    }
    if (html.includes('linkedin.com/')) {
      const m = html.match(/href=["'](https?:\/\/(?:www\.)?linkedin\.com\/[^"'\s]+)["']/i);
      if (m?.[1]) socialLinks.linkedin = m[1];
    }
    if (html.includes('facebook.com/')) {
      const m = html.match(/href=["'](https?:\/\/facebook\.com\/[^"'\s]+)["']/i);
      if (m?.[1]) socialLinks.facebook = m[1];
    }

    // 10. Raw text sample (cleaned of scripts and tags)
    const cleanText = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 4000);

    return {
      url: url.toString(),
      domain,
      title: title || domain,
      description,
      keywords,
      colors: sortedColors,
      fonts: Array.from(fontFamilies).slice(0, 5),
      logoUrls: logoUrls.slice(0, 4),
      headings,
      ctas,
      socialLinks,
      rawTextSample: cleanText,
      analyzedAt: new Date().toISOString(),
    };
  }

  /**
   * Helper to identify private IP ranges (IPv4 and IPv6)
   */
  private static isPrivateOrRestrictedIp(ip: string): boolean {
    // IPv6 loopback and link-local
    if (ip === '::1' || ip === '::' || ip.toLowerCase().startsWith('fe80:') || ip.toLowerCase().startsWith('fc00:')) {
      return true;
    }

    // IPv4 address check
    const parts = ip.split('.').map(Number);
    if (parts.length === 4 && parts.every((p) => !isNaN(p) && p >= 0 && p <= 255)) {
      // 0.0.0.0/8 (Broadcast)
      if (parts[0] === 0) return true;
      // 127.0.0.0/8 (Loopback)
      if (parts[0] === 127) return true;
      // 10.0.0.0/8 (Private A)
      if (parts[0] === 10) return true;
      // 172.16.0.0/12 (Private B)
      if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
      // 192.168.0.0/16 (Private C)
      if (parts[0] === 192 && parts[1] === 168) return true;
      // 169.254.0.0/16 (Link Local / Cloud Metadata)
      if (parts[0] === 169 && parts[1] === 254) return true;
      // 100.64.0.0/10 (Shared NAT)
      if (parts[0] === 100 && parts[1] >= 64 && parts[1] <= 127) return true;
    }

    return false;
  }

  private static normalizeHex(hex: string): string {
    if (hex.length === 4) {
      return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`.toUpperCase();
    }
    return hex.toUpperCase();
  }

  private static resolveRelativeUrl(href: string, base: URL): string {
    try {
      return new URL(href, base).toString();
    } catch {
      return href;
    }
  }
}
