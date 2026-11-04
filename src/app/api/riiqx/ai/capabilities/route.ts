// =============================================================================
// RIIQX — Model Capability Discovery API Route
// GET /api/riiqx/ai/capabilities
// =============================================================================

import { NextResponse } from 'next/server';
import { MASTER_MODEL_CAPABILITY_CATALOG, CapabilityRegistry } from '@/services/ai/capability-registry';
import { ModelRouter } from '@/lib/riiqx/model-router';

export async function GET() {
  const modelsWithHealth = MASTER_MODEL_CAPABILITY_CATALOG.map((m) => {
    const isConfigured = m.provider === 'local' ? true : ModelRouter.isProviderConfigured(m.provider);
    return {
      ...m,
      isConfigured,
      status: isConfigured ? 'available' : 'unconfigured_key',
    };
  });

  return NextResponse.json({
    success: true,
    totalModels: modelsWithHealth.length,
    configuredModels: modelsWithHealth.filter((m) => m.isConfigured).length,
    models: modelsWithHealth,
  });
}
