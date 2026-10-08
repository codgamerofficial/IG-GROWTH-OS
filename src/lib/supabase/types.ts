// =============================================================================
// PujaHop Kolkata: Supabase Database TypeScript Definitions
// Schema Version: 2026-10-08
// =============================================================================

export * from '../types/pujahop';

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface Approval {
  id: string;
  item_id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approved_by?: string;
  notes?: string;
  created_at: string;
}
