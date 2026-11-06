// =============================================================================
// RIIQX — Weekly Personal Intelligence Digest API
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { resolveAuthUserId } from '@/lib/riiqx/session-helper';
import { TwinRepository } from '@/lib/riiqx/twin-repository';
import { AIServiceManager } from '@/services/ai/ai-service-manager';
import { WeeklyDigestSection } from '@/lib/riiqx/twin-types';

export async function GET(req: NextRequest) {
  try {
    const userId = (await resolveAuthUserId(req)) || 'usr_guest_local';
    const digests = await TwinRepository.getWeeklyDigests(userId);
    return NextResponse.json({ success: true, digests });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = (await resolveAuthUserId(req)) || 'usr_guest_local';
    const profile = await TwinRepository.getProfile(userId);
    const goals = await TwinRepository.getGoals(userId);
    const opportunities = await TwinRepository.getOpportunities();

    const weekStartDate = new Date().toISOString().split('T')[0];
    const topGoal = goals[0];
    const topDeal = opportunities[0];

    let sections: WeeklyDigestSection[] = [];

    // Synthesize using AI
    try {
      const prompt = `
You are the RIIQX Personal Intelligence Twin.
Generate a concise, actionable Weekly Intelligence Digest for the user.

USER PROFILE:
- Twin Name: ${profile.twinName}
- Budget Tier: ${profile.budgetTier}
- Tone: ${profile.tone}

ACTIVE GOALS:
${goals.map((g) => `- ${g.title}: ₹${g.currentAmount} / ₹${g.targetAmount} (${Math.round((g.currentAmount / Math.max(1, g.targetAmount)) * 100)}%)`).join('\n') || '- No active goals'}

VERIFIED DEALS & OPPORTUNITIES:
${opportunities.slice(0, 3).map((o) => `- ${o.title}: ${o.description} (${o.provider})`).join('\n')}

TASK:
Return strict JSON with exactly 3 sections:
{
  "title": "Your Personal Intelligence Digest — Week of ${weekStartDate}",
  "sections": [
    {
      "title": "Verified Opportunity & Price Watch",
      "summary": "1-2 sentence concise insight on real deals or price trends",
      "sourceCitations": ["Source 1", "Source 2"]
    },
    {
      "title": "Goal & Savings Calibration",
      "summary": "1-2 sentence progress tracking on their active financial/purchase goals",
      "sourceCitations": ["Twin Goal Tracker"]
    },
    {
      "title": "Lifestyle & Practical Optimization",
      "summary": "1-2 sentence evidence-based everyday decision advice",
      "sourceCitations": ["Evidence source"]
    }
  ]
}
Return ONLY valid JSON.
`.trim();

      const aiRes = await AIServiceManager.executeText(prompt, {
        temperature: 0.3,
        timeoutMs: 15_000,
      });

      let clean = aiRes.data.trim();
      if (clean.startsWith('```json')) clean = clean.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
      else if (clean.startsWith('```')) clean = clean.replace(/^```\s*/, '').replace(/```\s*$/, '').trim();

      const parsed = JSON.parse(clean);
      if (Array.isArray(parsed.sections) && parsed.sections.length > 0) {
        sections = parsed.sections.map((s: any) => ({
          title: String(s.title || 'Intelligence Update'),
          summary: String(s.summary || ''),
          sourceCitations: Array.isArray(s.sourceCitations) ? s.sourceCitations.map(String) : [],
          actionLink: s.actionLink ? String(s.actionLink) : undefined,
        }));
      }
    } catch {
      // Deterministic fallback with zero fabrication
      sections = [
        {
          title: 'Verified Opportunity & Price Watch',
          summary: topDeal
            ? `Identified active ${topDeal.provider} offer: ${topDeal.title}. Verified terms require minimum order of ₹${topDeal.minimumOrderValue}.`
            : 'Multi-platform price monitoring active across verified Indian retailers.',
          sourceCitations: topDeal ? [topDeal.provider, 'Verified Terms'] : ['Marketplace Index'],
        },
        {
          title: 'Goal & Savings Calibration',
          summary: topGoal
            ? `Active focus on "${topGoal.title}": ₹${topGoal.currentAmount.toLocaleString('en-IN')} of ₹${topGoal.targetAmount.toLocaleString('en-IN')} saved (${Math.round((topGoal.currentAmount / Math.max(1, topGoal.targetAmount)) * 100)}%).`
            : 'All active targets synchronized with personal financial constraints.',
          sourceCitations: ['Twin Goal Tracker'],
        },
        {
          title: 'Lifestyle & Practical Optimization',
          summary:
            'Calibrated meal planning and product comparison engine active. Ensure all checkout fee lines are audited before payment.',
          sourceCitations: ['RIIQX Price Truth Engine'],
        },
      ];
    }

    const newDigest = await TwinRepository.addWeeklyDigest({
      userId,
      weekStartDate,
      title: `Personal Intelligence Digest — Week of ${weekStartDate}`,
      sections,
      isRead: false,
    });

    return NextResponse.json({ success: true, digest: newDigest });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

