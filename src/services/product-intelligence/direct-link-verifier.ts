// =============================================================================
// RIIQX — Direct Buying Link Verifier & Destination Validator
// "BUY FROM STORE" Verification • Strict PDP Validation • Zero Fake Buy Now Buttons
// =============================================================================

import { LinkVerificationStatus } from './types';
import { ProductURLExtractor } from './url-extractor';

export interface VerifiedBuyingLinkResult {
  isValid: boolean;
  isDirectPdp: boolean;
  canonicalProductUrl: string;
  purchaseUrl: string;
  status: LinkVerificationStatus;
  retailerDomain: string;
  retailerName: string;
  accessRestrictions: string[];
  verificationNote: string;
}

export class DirectLinkVerifier {
  /**
   * Validates whether a URL is an authentic, accessible Product Detail Page (PDP)
   */
  public static verifyLink(rawUrl: string, expectedRetailerDomain?: string): VerifiedBuyingLinkResult {
    if (!rawUrl || !ProductURLExtractor.isSafeUrl(rawUrl)) {
      return {
        isValid: false,
        isDirectPdp: false,
        canonicalProductUrl: rawUrl || '',
        purchaseUrl: rawUrl || '',
        status: 'broken_or_inaccessible',
        retailerDomain: '',
        retailerName: 'Unknown',
        accessRestrictions: ['Unsafe or invalid URL protocol'],
        verificationNote: 'Direct purchase link failed safety audit.',
      };
    }

    try {
      const { canonicalUrl, domain, retailerName, canonicalIdentifier } = ProductURLExtractor.canonicalizeUrl(rawUrl);
      const cleanDomain = domain.toLowerCase().replace(/^(?:dl|m|www)\./, '');

      // Verify domain consistency if expected
      if (expectedRetailerDomain) {
        const cleanExpected = expectedRetailerDomain.toLowerCase().replace(/^(?:dl|m|www)\./, '');
        if (!cleanDomain.includes(cleanExpected) && !cleanExpected.includes(cleanDomain)) {
          return {
            isValid: false,
            isDirectPdp: false,
            canonicalProductUrl: canonicalUrl,
            purchaseUrl: rawUrl,
            status: 'broken_or_inaccessible',
            retailerDomain: cleanDomain,
            retailerName,
            accessRestrictions: ['Domain mismatch with claimed merchant'],
            verificationNote: `URL domain (${cleanDomain}) does not match expected store (${cleanExpected}).`,
          };
        }
      }

      const parsed = new URL(rawUrl);
      const path = parsed.pathname.toLowerCase();
      const accessRestrictions: string[] = [];

      // Check mobile app share vectors
      if (parsed.hostname.toLowerCase().startsWith('dl.') || rawUrl.includes('/s/')) {
        accessRestrictions.push('Mobile share link: redirects to canonical web storefront');
      }

      // Check generic search or category pages
      const isSearchOrCategory =
        path.includes('/search') ||
        path.includes('/s') && parsed.searchParams.has('k') ||
        path.includes('/searchb') ||
        path === '/' ||
        path === '';

      if (isSearchOrCategory) {
        return {
          isValid: true,
          isDirectPdp: false,
          canonicalProductUrl: canonicalUrl,
          purchaseUrl: rawUrl,
          status: 'direct_link_unverified',
          retailerDomain: cleanDomain,
          retailerName,
          accessRestrictions: [...accessRestrictions, 'Store search listing (Direct PDP unconfirmed)'],
          verificationNote: 'Direct purchase link not verified (Opens store search page).',
        };
      }

      // Exact PDP Path Verification by Indian Retailer:
      let isVerifiedPdp = false;

      if (cleanDomain.includes('amazon.')) {
        // Amazon PDP format: /dp/ASIN or /gp/product/ASIN
        isVerifiedPdp = Boolean(canonicalIdentifier && /^[A-Z0-9]{10}$/i.test(canonicalIdentifier));
      } else if (cleanDomain.includes('flipkart.com')) {
        // Flipkart PDP format: ?pid=... or /p/itm...
        isVerifiedPdp = Boolean(canonicalIdentifier && canonicalIdentifier.length >= 6);
      } else if (cleanDomain.includes('myntra.com')) {
        // Myntra PDP format: /1234567/buy or /\d+
        isVerifiedPdp = Boolean(canonicalIdentifier && /^\d+$/.test(canonicalIdentifier));
      } else if (cleanDomain.includes('tatacliq.com')) {
        // Tata CLiQ PDP format: /p-mp0000000...
        isVerifiedPdp = Boolean(canonicalIdentifier && canonicalIdentifier.length >= 4);
      } else if (cleanDomain.includes('croma.com')) {
        // Croma PDP format: /p/123456
        isVerifiedPdp = Boolean(canonicalIdentifier && /^\d+$/.test(canonicalIdentifier));
      } else if (cleanDomain.includes('reliancedigital.in')) {
        // Reliance Digital PDP format: /p/...
        isVerifiedPdp = Boolean(canonicalIdentifier && canonicalIdentifier.length >= 3);
      } else if (cleanDomain.includes('nykaa.com')) {
        // Nykaa PDP format: /p/123456
        isVerifiedPdp = Boolean(canonicalIdentifier && /^\d+$/.test(canonicalIdentifier));
      } else {
        // Other verified merchants: must have identifiable non-root product path
        isVerifiedPdp = path.length > 5 && !isSearchOrCategory;
      }

      return {
        isValid: true,
        isDirectPdp: isVerifiedPdp,
        canonicalProductUrl: canonicalUrl,
        purchaseUrl: rawUrl,
        status: isVerifiedPdp ? 'verified_pdp' : 'direct_link_unverified',
        retailerDomain: cleanDomain,
        retailerName,
        accessRestrictions,
        verificationNote: isVerifiedPdp
          ? 'Verified Direct Product Detail Page (PDP)'
          : 'Direct purchase link not verified.',
      };
    } catch {
      return {
        isValid: false,
        isDirectPdp: false,
        canonicalProductUrl: rawUrl,
        purchaseUrl: rawUrl,
        status: 'broken_or_inaccessible',
        retailerDomain: '',
        retailerName: 'Unknown',
        accessRestrictions: ['URL parsing error'],
        verificationNote: 'Direct purchase link not verified.',
      };
    }
  }
}

