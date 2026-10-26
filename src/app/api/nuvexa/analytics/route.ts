import { NextResponse } from 'next/server';
import {
  listAnalyticsRecords,
  computeAnalyticsSummary,
  generateOptimizationRecommendations,
} from '@/lib/nuvexa/analytics';

export async function GET() {
  const records = listAnalyticsRecords();
  const summary = computeAnalyticsSummary();
  const recommendations = generateOptimizationRecommendations();

  return NextResponse.json({
    success: true,
    summary,
    records,
    recommendations,
  });
}
