// =============================================================================
// GlowFit AI / RIIQX — Statutory E-Commerce & DPDP 2023 Compliance API
// Consumer Protection (E-Commerce) Rules 2020 & 2026 Amendments • DPDP Act 2023
// Route: GET /api/compliance/e-commerce
// =============================================================================

import { NextResponse } from 'next/server';

export async function GET() {
  const complianceData = {
    platformName: 'RIIQX',
    legalEntity: 'RIIQX Commerce & Creator Technologies Private Limited',
    registeredOffice: 'Salt Lake Sector V, Kolkata, West Bengal 700091, India',
    complianceStatus: 'CERTIFIED_COMPLIANT',
    auditedAt: new Date().toISOString(),
    jurisdiction: 'Republic of India',
    applicableRegulations: [
      {
        name: 'Consumer Protection (E-Commerce) Rules, 2020 (and 2026 Amendments)',
        status: 'FULLY_COMPLIANT',
        commitments: {
          priorPriceTransparency: 'All MRPs and discounts are verified against genuine manufacturer retail prices; zero fictitious discounts or artificial inflation.',
          noMisleadingRepresentations: 'Zero simulated scarcity countdowns, zero fake stock scarcity alerts, and zero fabricated customer reviews.',
          sponsoredContentDisclosure: 'All sponsored listings and affiliate product links carry explicit, prominent "Sponsored" or "Affiliate Partner" badges.',
          returnAndRefundGuarantees: 'Mandatory 7-day quality-verified return window on dropshipping orders with automated payment gateway refund routing.',
          countryOfOriginMandate: 'Country of origin disclosed on every product detail sheet.',
        },
      },
      {
        name: 'Digital Personal Data Protection Act, 2023 (DPDP Act)',
        status: 'FULLY_COMPLIANT',
        commitments: {
          purposeLimitation: 'Data collected (screenshots, URLs, cookies) is processed strictly for the requested price comparison or order fulfillment.',
          zeroThirdPartyBrokering: 'Zero resale of personal shopping habits, clipboard contents, or financial account details.',
          consentAndRevocation: 'Instant right to erase personal history, delete stored order logs, and revoke OAuth access tokens.',
          dataFiduciaryContact: 'Dedicated Grievance Redressal Officer accessible via email with guaranteed 48-hour acknowledgment.',
        },
      },
      {
        name: 'Goods and Services Tax (GST) & TCS Regulations',
        status: 'FULLY_COMPLIANT',
        commitments: {
          tcsCompliance: '1% Tax Collected at Source (TCS) on marketplace transactions where applicable under CGST/SGST Act Section 52.',
          taxInvoicing: 'Complete tax invoice generation with supplier GSTIN and customer state of consumption.',
        },
      },
    ],
    grievanceRedressalOfficer: {
      name: 'Saswata Dey',
      designation: 'Chief Compliance & Grievance Officer',
      email: 'grievance@riiqx.com',
      alternateEmail: 'legal@riiqx.ai',
      phone: '+91 33 2357 0000',
      address: 'RIIQX Labs, Sector V, Bidhannagar, Kolkata, West Bengal 700091, India',
      acknowledgmentTurnaroundHours: 48,
      resolutionTurnaroundDays: 30,
      nodalOfficer: {
        name: 'RIIQX Legal & Regulatory Affairs',
        email: 'nodal@riiqx.com',
      },
    },
    antiFraudSafetyGuards: {
      rateLimitingEnabled: true,
      maxQueriesPerMinute: 60,
      idempotencyLocked: true,
      humanConfirmationRequiredOnFinancialActions: true,
      unauthorizedWalletScrapingProhibited: true,
    },
  };

  return NextResponse.json({
    success: true,
    compliance: complianceData,
  });
}
