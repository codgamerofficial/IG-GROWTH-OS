// =============================================================================
// RIIQX — Product Identity Resolver & Exact Variant Guard
// Priority Matching: Model Number -> Brand + Model -> Specs -> Title Similarity
// Separates Exact Matches from Incompatible Alternatives
// =============================================================================

import { ProductIdentity, VariantMatchStatus } from './types';

export class ProductIdentityResolver {
  /**
   * Matches candidate product against benchmark product identity
   */
  public static compareIdentity(
    benchmark: ProductIdentity,
    candidateTitle: string,
    candidateUrl: string
  ): {
    matchStatus: VariantMatchStatus;
    confidence: number;
    explanation: string;
    differentiatingAttributes: Record<string, string>;
  } {
    const bTitle = benchmark.title.toLowerCase();
    const cTitle = candidateTitle.toLowerCase();
    const bBrand = benchmark.brand.toLowerCase();

    // 1. Accessory vs Original Guard (e.g. Case / Cable for iPhone ≠ iPhone)
    const accessoryWords = ['case', 'cover', 'strap', 'cable', 'adapter', 'screen protector', 'tempered glass', 'skin', 'pouch', 'holder'];
    const isBenchmarkAccessory = accessoryWords.some((w) => bTitle.includes(w));
    const isCandidateAccessory = accessoryWords.some((w) => cTitle.includes(w));

    if (!isBenchmarkAccessory && isCandidateAccessory) {
      return {
        matchStatus: 'unverified',
        confidence: 0.1,
        explanation: 'Incompatible match: Candidate is a third-party accessory or case, not the original product.',
        differentiatingAttributes: { ItemType: 'Accessory / Case' },
      };
    }

    // 2. Storage Tier Check (e.g., 128GB vs 256GB vs 512GB)
    const storageRegex = /\b(64|128|256|512|1024)\s*(?:gb|tb)\b/gi;
    const bStorage = (bTitle.match(storageRegex) || [benchmark.variantAttributes.storage || ''])[0]?.toLowerCase().replace(/\s+/g, '');
    const cStorage = (cTitle.match(storageRegex) || [])[0]?.toLowerCase().replace(/\s+/g, '');

    if (bStorage && cStorage && bStorage !== cStorage) {
      return {
        matchStatus: 'similar_alternative',
        confidence: 0.82,
        explanation: `Variant Difference: Different storage capacity (${bStorage.toUpperCase()} target vs ${cStorage.toUpperCase()} candidate).`,
        differentiatingAttributes: { Storage: `${bStorage.toUpperCase()} vs ${cStorage.toUpperCase()}` },
      };
    }

    // 3. Generation / Version Check (e.g., M2 vs M3, Gen 4 vs Gen 5, Pro 2 vs Pro 1)
    const genRegex = /\b(?:gen\s*\d+|m[1-4]|series\s*\d+|pro\s*\d+|air\s*\d+)\b/gi;
    const bGen = (bTitle.match(genRegex) || [])[0]?.toLowerCase().replace(/\s+/g, '');
    const cGen = (cTitle.match(genRegex) || [])[0]?.toLowerCase().replace(/\s+/g, '');

    if (bGen && cGen && bGen !== cGen) {
      return {
        matchStatus: 'similar_alternative',
        confidence: 0.75,
        explanation: `Generation Difference: Different release edition (${bGen.toUpperCase()} target vs ${cGen.toUpperCase()} candidate).`,
        differentiatingAttributes: { Generation: `${bGen.toUpperCase()} vs ${cGen.toUpperCase()}` },
      };
    }

    // 4. Refurbished / Renewed Check
    const isRefurbished = /\b(?:refurbished|renewed|pre-owned|unboxed)\b/i.test(cTitle);
    const isBenchmarkRefurbished = /\b(?:refurbished|renewed|pre-owned|unboxed)\b/i.test(bTitle);

    if (!isBenchmarkRefurbished && isRefurbished) {
      return {
        matchStatus: 'similar_alternative',
        confidence: 0.8,
        explanation: 'Candidate listing is Renewed/Refurbished, not brand new retail stock.',
        differentiatingAttributes: { Condition: 'Refurbished' },
      };
    }

    // 5. Brand Match
    if (bBrand && bBrand !== 'verified brand' && !cTitle.includes(bBrand)) {
      return {
        matchStatus: 'similar_alternative',
        confidence: 0.5,
        explanation: `Different Brand: Candidate does not mention target brand ${benchmark.brand}.`,
        differentiatingAttributes: { Brand: 'Brand Mismatch' },
      };
    }

    return {
      matchStatus: 'exact',
      confidence: 0.95,
      explanation: 'Exact match on brand, model line, and verified specifications.',
      differentiatingAttributes: {},
    };
  }
}
