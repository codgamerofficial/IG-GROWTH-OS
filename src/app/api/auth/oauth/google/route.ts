// =============================================================================
// RIIQX — Google OAuth Gateway & Pre-Flight Reachability Probe
// Validates Supabase Hostname, Probes Google Provider Status & Enforces Account Chooser
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import dns from 'dns';
import { promisify } from 'util';

const dnsLookup = promisify(dns.lookup);

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawNext = searchParams.get('next') || '/';
    const safeNext = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/';

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    if (!supabaseUrl) {
      return NextResponse.json(
        {
          reachable: false,
          error: 'missing_supabase_url',
          message: 'NEXT_PUBLIC_SUPABASE_URL is not configured in your environment.',
        },
        { status: 400 }
      );
    }

    let urlObj: URL;
    try {
      urlObj = new URL(supabaseUrl);
    } catch {
      return NextResponse.json(
        {
          reachable: false,
          error: 'malformed_supabase_url',
          message: `The configured Supabase URL "${supabaseUrl}" is invalid.`,
        },
        { status: 400 }
      );
    }

    const hostname = urlObj.hostname;
    const projectRef = hostname.split('.')[0] || 'unknown';

    // 1. Probe DNS resolution
    let dnsResolves = false;
    try {
      await dnsLookup(hostname);
      dnsResolves = true;
    } catch {
      dnsResolves = false;
    }

    if (!dnsResolves) {
      return NextResponse.json({
        reachable: false,
        error: 'supabase_dns_nxdomain',
        hostname,
        projectRef,
        restoreUrl: `https://supabase.com/dashboard/project/${projectRef}`,
        message: `Supabase host "${hostname}" could not be resolved (DNS NXDOMAIN). If this project is on the Free Tier, it was automatically paused due to inactivity.`,
      });
    }

    // 2. Probe HTTP reachability with 3-second timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    let isHttpReachable = false;
    try {
      const probeRes = await fetch(`${supabaseUrl}/auth/v1/health`, {
        signal: controller.signal,
        headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '' },
      });
      isHttpReachable = probeRes.ok;
    } catch {
      isHttpReachable = false;
    } finally {
      clearTimeout(timeout);
    }

    if (!isHttpReachable) {
      return NextResponse.json({
        reachable: false,
        error: 'supabase_service_unreachable',
        hostname,
        projectRef,
        restoreUrl: `https://supabase.com/dashboard/project/${projectRef}`,
        message: `Supabase project "${projectRef}" is not responding to authentication probes.`,
      });
    }

    // 3. Construct Google OAuth Authorization URL with forced account chooser
    const origin = req.nextUrl.origin;
    const callbackUrl = `${origin}/auth/callback?next=${encodeURIComponent(safeNext)}`;
    
    // Always include prompt=select_account to ensure Google displays the account selection picker
    const oauthAuthorizeUrl = `${supabaseUrl}/auth/v1/authorize?provider=google&prompt=select_account&access_type=offline&redirect_to=${encodeURIComponent(
      callbackUrl
    )}`;

    // 4. Probe whether Google Provider is enabled in Supabase
    try {
      const authProbe = await fetch(oauthAuthorizeUrl, {
        method: 'GET',
        redirect: 'manual',
        headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '' },
      });

      if (authProbe.status === 400) {
        const errJson = await authProbe.json().catch(() => ({}));
        if (errJson.msg?.includes('provider is not enabled') || errJson.error_code === 'validation_failed') {
          return NextResponse.json({
            reachable: false,
            error: 'google_provider_disabled',
            hostname,
            projectRef,
            providersUrl: `https://supabase.com/dashboard/project/${projectRef}/auth/providers`,
            supabaseCallbackUrl: `${supabaseUrl}/auth/v1/callback`,
            message: `Google Sign-In provider is currently disabled in your Supabase project "${projectRef}".`,
          });
        }
      }
    } catch {
      // If probe network fails, fallback to passing URL
    }

    return NextResponse.json({
      reachable: true,
      url: oauthAuthorizeUrl,
      projectRef,
      callbackUrl,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error during OAuth preflight';
    return NextResponse.json({ reachable: false, error: 'internal_error', message: msg }, { status: 500 });
  }
}
