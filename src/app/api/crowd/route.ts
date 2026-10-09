import { NextRequest, NextResponse } from 'next/server';
import { repository } from '@/lib/supabase/repository';
import { VERIFIED_KOLKATA_PANDALS } from '@/lib/data/kolkata-pandals';
import { calculateDistanceMeters } from '@/lib/utils/exif';
import { getServiceSupabase } from '@/lib/supabase/server';
import { CrowdLevel } from '@/lib/types/pujahop';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pandalId = searchParams.get('pandal_id') || undefined;
    const reports = await repository.getCrowdReports(pandalId);

    // Compute rolling 2-hour analytics
    const pandal = pandalId
      ? VERIFIED_KOLKATA_PANDALS.find((p) => p.id === pandalId || (p as any).slug === pandalId)
      : undefined;
    const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
    const recentReports = reports.filter(
      (r) => new Date(r.reported_at).getTime() > twoHoursAgo
    );

    let avgWaitMinutes = 35; // Default Kolkata festival baseline
    let currentLevel: CrowdLevel = 'MODERATE';
    let surgeDetected = false;
    let verifiedCount = 0;

    if (recentReports.length > 0) {
      const totalWait = recentReports.reduce((acc, r) => acc + (r.wait_time_minutes || 30), 0);
      avgWaitMinutes = Math.round(totalWait / recentReports.length);
      verifiedCount = recentReports.filter((r) => r.verified).length;

      if (avgWaitMinutes <= 20) currentLevel = 'LOW';
      else if (avgWaitMinutes <= 45) currentLevel = 'MODERATE';
      else if (avgWaitMinutes <= 75) currentLevel = 'HIGH';
      else currentLevel = 'EXTREME';

      surgeDetected = avgWaitMinutes >= 60 || recentReports.some((r) => r.crowd_level === 'EXTREME');
    } else if (pandal) {
      // Baseline based on popularity score
      const pop = pandal.overall_score || 8.0;
      avgWaitMinutes = Math.round(pop * 5 + 10); // 40-55 mins baseline
      currentLevel = avgWaitMinutes > 45 ? 'HIGH' : 'MODERATE';
    }

    const summary = {
      pandal_id: pandalId,
      pandal_name: pandal?.name,
      avg_wait_minutes: avgWaitMinutes,
      crowd_level: currentLevel,
      surge_detected: surgeDetected,
      verified_reports_count: verifiedCount,
      total_reports_count: reports.length,
      last_reported_at: reports[0]?.reported_at || new Date().toISOString(),
      advisory:
        currentLevel === 'LOW'
          ? 'Darshan queue moving very swiftly. Minimal waiting.'
          : currentLevel === 'MODERATE'
          ? 'Queue moving at steady pace. Average queue depth ~50-80 meters.'
          : currentLevel === 'HIGH'
          ? 'Heavy festive darshan turnout. Enter through designated queue barricades.'
          : 'Extreme crowd surge. Police holding line active at barricade entry.',
    };

    return NextResponse.json({
      success: true,
      count: reports.length,
      summary,
      reports: reports.slice(0, 30),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pandal_id, metro_station_id, crowd_level, wait_time_minutes, user_lat, user_lng, notes } = body;

    if (!crowd_level) {
      return NextResponse.json({ success: false, error: 'crowd_level is required' }, { status: 400 });
    }

    // Geodesic verification if coordinates provided
    let isVerified = false;
    let confidence = 0.7;
    let distanceMeters: number | null = null;
    let sourceLabel = body.source || 'Community Reporter';

    if (pandal_id && typeof user_lat === 'number' && typeof user_lng === 'number') {
      const targetPandal = VERIFIED_KOLKATA_PANDALS.find(
        (p) => p.id === pandal_id || (p as any).slug === pandal_id
      );
      if (targetPandal) {
        distanceMeters = calculateDistanceMeters(user_lat, user_lng, targetPandal.lat, targetPandal.lng);
        if (distanceMeters <= 600) {
          isVerified = true;
          confidence = 0.98;
          sourceLabel = `Verified Ground GPS (${distanceMeters}m from Pandal)`;
        } else {
          isVerified = false;
          confidence = 0.65;
          sourceLabel = `Remote Community Report (${Math.round(distanceMeters / 1000)}km away)`;
        }
      }
    }

    const waitTime = Number(wait_time_minutes) || (crowd_level === 'LOW' ? 15 : crowd_level === 'HIGH' ? 60 : crowd_level === 'EXTREME' ? 90 : 35);

    const report = await repository.addCrowdReport({
      pandal_id,
      metro_station_id,
      crowd_level: crowd_level as CrowdLevel,
      wait_time_minutes: waitTime,
      source: sourceLabel,
      source_type: isVerified ? 'ON_GROUND_SURVEY' : 'USER_REPORT',
      confidence,
      verified: isVerified,
    });

    // Optionally write to remote Supabase crowd_reports table if server service role configured
    const supabase = getServiceSupabase();
    if (supabase && pandal_id) {
      try {
        await (supabase.from('crowd_reports') as any).insert({
          pandal_id,
          crowd_level,
          wait_time_minutes: waitTime,
          source: sourceLabel,
          source_type: isVerified ? 'ON_GROUND_SURVEY' : 'USER_REPORT',
          confidence,
          verified: isVerified,
          reported_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        });
      } catch (dbErr) {
        console.warn('Remote Supabase insert for crowd_reports failed, preserved in repository store:', dbErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        report,
        verification: {
          is_verified: isVerified,
          distance_meters: distanceMeters,
          confidence,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

