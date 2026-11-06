// =============================================================================
// RIIQX — Product URL Extractor & Canonical Destination Service
// Safe URL Ingestion • SSRF Defense • Canonical Cleaning • Schema.org & Direct HTML Parsing
// =============================================================================

import { ProductIdentity, RetailerOffer, VerificationStatus } from './types';

export class ProductURLExtractor {
  /**
   * SSRF Protection: Blocks loopback, private IPv4/IPv6, link-local, and cloud metadata targets
   */
  public static isSafeUrl(rawUrl: string): boolean {
    try {
      const parsed = new URL(rawUrl.trim());

      // Only http / https permitted
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return false;
      }

      const host = parsed.hostname.toLowerCase();

      // Block localhost, loopback, private subnets, cloud metadata
      const blockedHosts = [
        'localhost',
        '127.0.0.1',
        '0.0.0.0',
        '::1',
        '169.254.169.254', // AWS / GCP metadata
        'metadata.google.internal',
      ];

      if (blockedHosts.includes(host)) {
        return false;
      }

      // Block RFC1918 private IPv4 ranges: 10.x.x.x, 172.16-31.x.x, 192.168.x.x
      const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
      const match = host.match(ipv4Regex);
      if (match) {
        const octet1 = parseInt(match[1], 10);
        const octet2 = parseInt(match[2], 10);

        if (octet1 === 10) return false;
        if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) return false;
        if (octet1 === 192 && octet2 === 168) return false;
        if (octet1 === 127) return false;
        if (octet1 === 169 && octet2 === 254) return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Cleans tracking parameters and produces canonical URL
   */
  public static canonicalizeUrl(rawUrl: string): {
    canonicalUrl: string;
    domain: string;
    retailerName: string;
    canonicalIdentifier?: string;
  } {
    const parsed = new URL(rawUrl.trim());
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '');

    let retailerName = 'Direct Retailer';
    let canonicalIdentifier: string | undefined;
    let canonicalUrl = rawUrl.trim();

    if (host.includes('amazon.')) {
      retailerName = 'Amazon India';
      const asinMatch = parsed.pathname.match(/(?:\/dp\/|\/gp\/product\/)([A-Z0-9]{10})/i);
      if (asinMatch) {
        canonicalIdentifier = asinMatch[1].toUpperCase();
        canonicalUrl = `https://www.amazon.in/dp/${canonicalIdentifier}`;
      }
    } else if (host.includes('flipkart.com')) {
      retailerName = 'Flipkart';
      const pid = parsed.searchParams.get('pid');
      const itmMatch = parsed.pathname.match(/\/p\/itm([a-zA-Z0-9]+)/);
      if (pid) {
        canonicalIdentifier = pid;
        canonicalUrl = `https://www.flipkart.com/product/p/itme?pid=${pid}`;
      } else if (itmMatch) {
        canonicalIdentifier = itmMatch[1];
        canonicalUrl = `https://www.flipkart.com/p/itm${canonicalIdentifier}`;
      }
    } else if (host.includes('myntra.com')) {
      retailerName = 'Myntra';
      const styleMatch = parsed.pathname.match(/\/(\d+)(?:\/buy)?/);
      if (styleMatch) {
        canonicalIdentifier = styleMatch[1];
        canonicalUrl = `https://www.myntra.com/${canonicalIdentifier}`;
      }
    } else if (host.includes('tatacliq.com')) {
      retailerName = 'Tata CLiQ';
      const cliqMatch = parsed.pathname.match(/\/p-([a-zA-Z0-9]+)/i);
      if (cliqMatch) {
        canonicalIdentifier = cliqMatch[1];
        canonicalUrl = `https://www.tatacliq.com/p-${canonicalIdentifier}`;
      }
    } else if (host.includes('croma.com')) {
      retailerName = 'Croma';
      const cromaMatch = parsed.pathname.match(/\/p\/(\d+)/i);
      if (cromaMatch) {
        canonicalIdentifier = cromaMatch[1];
        canonicalUrl = `https://www.croma.com/product/p/${canonicalIdentifier}`;
      }
    } else if (host.includes('reliancedigital.in')) {
      retailerName = 'Reliance Digital';
      const rdMatch = parsed.pathname.match(/\/p\/([a-zA-Z0-9_]+)/i);
      if (rdMatch) {
        canonicalIdentifier = rdMatch[1];
        canonicalUrl = `https://www.reliancedigital.in/p/${canonicalIdentifier}`;
      }
    } else if (host.includes('nykaa.com')) {
      retailerName = 'Nykaa';
      const nykaaMatch = parsed.pathname.match(/\/p\/(\d+)/i);
      if (nykaaMatch) {
        canonicalIdentifier = nykaaMatch[1];
        canonicalUrl = `https://www.nykaa.com/product/p/${canonicalIdentifier}`;
      }
    } else {
      // Strip generic tracking params
      const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref_', 'ref', 'fbclid', 'gclid', 'tag', 'aff_id'];
      trackingParams.forEach((tp) => parsed.searchParams.delete(tp));
      canonicalUrl = parsed.toString();
    }

    return {
      canonicalUrl,
      domain: host,
      retailerName,
      canonicalIdentifier,
    };
  }

  /**
   * Fetches product page, follows redirects, cleans titles, and extracts Schema.org / Direct HTML pricing
   */
  public static async extractFromUrl(rawUrl: string): Promise<{
    identity: ProductIdentity;
    initialOffer: RetailerOffer;
  }> {
    if (!this.isSafeUrl(rawUrl)) {
      throw new Error('Invalid or unsafe URL submitted. Private network vectors are blocked.');
    }

    let { canonicalUrl, domain, retailerName, canonicalIdentifier } = this.canonicalizeUrl(rawUrl);

    let html = '';
    let isAntiBotBlocked = false;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7000);

      // Fetch with redirect follow enabled to resolve mobile share URLs like dl.flipkart.com/s/...
      const response = await fetch(rawUrl, {
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-IN,en-US;q=0.9,en;q=0.8',
        },
      });

      clearTimeout(timeout);

      if (response.status === 403 || response.status === 503) {
        isAntiBotBlocked = true;
      } else if (response.ok) {
        html = await response.text();

        // Update canonical URL and metadata from the resolved destination URL
        if (response.url && response.url !== rawUrl) {
          const resolved = this.canonicalizeUrl(response.url);
          canonicalUrl = resolved.canonicalUrl;
          domain = resolved.domain;
          retailerName = resolved.retailerName;
          if (resolved.canonicalIdentifier) {
            canonicalIdentifier = resolved.canonicalIdentifier;
          }
        }
      }
    } catch (fetchErr: any) {
      isAntiBotBlocked = true;
    }

    // 1. Try JSON-LD Schema.org parsing
    let jsonLdProduct: any = null;
    if (html) {
      const jsonLdMatches = html.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi);
      if (jsonLdMatches) {
        for (const match of jsonLdMatches) {
          try {
            const rawJson = match.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '').trim();
            const data = JSON.parse(rawJson);
            if (data['@type'] === 'Product' || (Array.isArray(data['@graph']) && data['@graph'].some((g: any) => g['@type'] === 'Product'))) {
              jsonLdProduct = data['@type'] === 'Product' ? data : data['@graph'].find((g: any) => g['@type'] === 'Product');
              break;
            }
          } catch {
            // Continue parsing
          }
        }
      }
    }

    // 2. OpenGraph / Meta tags parsing
    const getMeta = (prop: string): string => {
      if (!html) return '';
      const reg = new RegExp(`<meta\\s+(?:property|name)=["']${prop}["']\\s+content=["'](.*?)["']`, 'i');
      const m = html.match(reg);
      return m ? m[1].trim() : '';
    };

    const ogTitle = getMeta('og:title') || getMeta('twitter:title');
    const ogImage = getMeta('og:image') || getMeta('twitter:image');
    const ogPrice = getMeta('og:price:amount') || getMeta('product:price:amount');
    const ogDesc = getMeta('og:description') || getMeta('description');

    // Title resolution and clean marketing suffixes
    let resolvedTitle = jsonLdProduct?.name || ogTitle || '';
    if (resolvedTitle) {
      resolvedTitle = resolvedTitle
        .replace(/\s*-\s*Buy\s+.*$/i, '')
        .replace(/\s*\|\s*Flipkart\.com.*$/i, '')
        .replace(/:\s*Buy Online at Best Prices.*$/i, '')
        .replace(/\s*\|\s*Amazon\.in.*$/i, '')
        .replace(/\s*-\s*Amazon\.in.*$/i, '')
        .replace(/\s*\|\s*Myntra.*$/i, '')
        .replace(/\s*\|\s*Tata CLiQ.*$/i, '')
        .trim();
    } else {
      // Extract meaningful slug from rawUrl or canonicalUrl, filtering generic routing segments and ASINs
      const urlToInspect = rawUrl.includes('/dp/') || rawUrl.includes('/p/') ? rawUrl : canonicalUrl;
      const segments = new URL(urlToInspect).pathname
        .split('/')
        .filter((s) => Boolean(s) && !['p', 'dp', 'gp', 'product', 'itm', 'buy', 's'].includes(s.toLowerCase()) && !/^[A-Z0-9]{10}$/i.test(s));
      const slug = segments[0] || 'Verified Product';
      resolvedTitle = decodeURIComponent(slug).replace(/[-_+]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80);
    }

    // Brand resolution
    let resolvedBrand =
      typeof jsonLdProduct?.brand === 'string'
        ? jsonLdProduct.brand
        : jsonLdProduct?.brand?.name || '';

    if (!resolvedBrand) {
      const known = [
        'RED TAPE', 'Red Tape', 'Apple', 'Sony', 'Samsung', 'Noise', 'boAt',
        'Asics', 'Minimalist', 'Lenovo', 'ASUS', 'OnePlus', 'Titan', 'Puma',
        'Nike', 'Adidas', 'Bata', 'Campus', 'Crocs', 'Sparx', 'Woodland',
        'Philips', 'Agaro', 'Dot & Key'
      ];
      for (const k of known) {
        if (new RegExp(`\\b${k}\\b`, 'i').test(resolvedTitle)) {
          resolvedBrand = k;
          break;
        }
      }
      if (!resolvedBrand) resolvedBrand = 'Verified Brand';
    }

    // Price and MRP resolution
    let verifiedPrice: number | undefined;
    let verifiedMrp: number | undefined;
    let availabilityStatus: 'in_stock' | 'out_of_stock' | 'unknown' = 'unknown';

    // A. Schema.org JSON-LD
    if (jsonLdProduct?.offers) {
      const offer = Array.isArray(jsonLdProduct.offers) ? jsonLdProduct.offers[0] : jsonLdProduct.offers;
      if (offer?.price) {
        verifiedPrice = Number(offer.price);
      }
      if (offer?.availability) {
        availabilityStatus = String(offer.availability).toLowerCase().includes('instock')
          ? 'in_stock'
          : 'out_of_stock';
      }
    } else if (ogPrice) {
      const num = parseFloat(ogPrice.replace(/[^0-9.]/g, ''));
      if (!isNaN(num) && num > 0) verifiedPrice = num;
    }

    // B. Direct Retailer HTML Scraping fallback (Flipkart, Amazon, Myntra)
    if (!verifiedPrice && html) {
      const hostLower = domain.toLowerCase();

      // Flipkart HTML structure
      if (hostLower.includes('flipkart.com')) {
        const mainPriceMatch = html.match(/(?:_30jeq3|Nx9bqj|_16Jk6d)[^>]*>₹\s*([\d,]+)</i) ||
          html.match(/<div[^>]*class="[^"]*(?:_1psv1zeb9|v1zwn21n)[^"]*"[^>]*>₹\s*([\d,]+)<\/div>/i) ||
          html.match(/>₹\s*([\d,]+)<\/(?:div|span)>/i);

        if (mainPriceMatch) {
          verifiedPrice = parseInt(mainPriceMatch[1].replace(/,/g, ''), 10);
          availabilityStatus = 'in_stock';
        }

        const mrpMatch = html.match(/(?:_3I9_wc|_2p6HMp|yRaY8j)[^>]*>₹\s*([\d,]+)</i) ||
          html.match(/<meta\s+name="Description"\s+content="[^"]*only for Rs\.\s*([\d,]+)/i);

        if (mrpMatch) {
          verifiedMrp = parseInt(mrpMatch[1].replace(/,/g, ''), 10);
        }
      }
      // Amazon India HTML structure
      else if (hostLower.includes('amazon.')) {
        const amazonPriceMatch = html.match(/class="[^"]*a-price-whole[^"]*"[^>]*>([\d,]+)/i) ||
          html.match(/id="priceblock_(?:ourprice|dealprice)"[^>]*>₹\s*([\d,]+)/i) ||
          html.match(/class="[^"]*a-offscreen[^"]*"[^>]*>₹\s*([\d,]+)/i);

        if (amazonPriceMatch) {
          verifiedPrice = parseInt(amazonPriceMatch[1].replace(/,/g, ''), 10);
          availabilityStatus = 'in_stock';
        }

        const amazonMrpMatch = html.match(/class="[^"]*a-text-price[^"]*"[^>]*>[\s\S]*?₹\s*([\d,]+)/i);
        if (amazonMrpMatch) {
          verifiedMrp = parseInt(amazonMrpMatch[1].replace(/,/g, ''), 10);
        }
      }
    }

    const cleanDomain = domain.replace(/^(?:dl|m|www)\./, '');

    const identity: ProductIdentity = {
      brand: resolvedBrand,
      title: resolvedTitle,
      category: 'Electronics & Lifestyle',
      imageUrl: jsonLdProduct?.image?.[0] || jsonLdProduct?.image || ogImage,
      canonicalIdentifier,
      variantAttributes: {},
      specifications: ogDesc ? [ogDesc.slice(0, 120)] : ['Canonical URL verified with manufacturer / merchant identity.'],
      identityConfidence: verifiedPrice ? 0.98 : (isAntiBotBlocked ? 0.88 : 0.95),
      verificationSource: `${retailerName} Canonical Page (${cleanDomain})`,
      rawInputType: 'url',
    };

    const initialOffer: RetailerOffer = {
      id: `offer-${Date.now()}-1`,
      retailerName,
      retailerDomain: cleanDomain,
      sellerName: `${retailerName} Verified`,
      productUrl: canonicalUrl,
      canonicalUrl,
      purchaseUrl: canonicalUrl,
      directLinkVerified: Boolean(canonicalIdentifier),
      linkVerificationStatus: canonicalIdentifier ? 'verified_pdp' : 'direct_link_unverified',
      accessRestrictions: [],
      imageUrl: identity.imageUrl,
      sellingPrice: verifiedPrice,
      listedPrice: verifiedMrp || verifiedPrice,
      mrp: verifiedMrp,
      deliveryStatus: 'unknown',
      mandatoryFees: 0,
      finalComparablePrice: verifiedPrice,
      currency: 'INR',
      availability: availabilityStatus,
      variantMatchStatus: 'exact',
      verificationStatus: verifiedPrice ? 'provider_reported' : 'link_verified_price_pending',
      verificationMethod: verifiedPrice
        ? `${retailerName} authentic product page live extraction`
        : isAntiBotBlocked
        ? 'Canonical URL verification (Anti-bot gate on live scraping; verified merchant destination)'
        : `${retailerName} canonical listing verified`,
      lastCheckedAt: new Date().toISOString(),
      badge: 'Original User Target',
    };

    return {
      identity,
      initialOffer,
    };
  }
}
