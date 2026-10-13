/**
 * Synthetic Pendo usage-data schema for the Halo demo app.
 *
 * Every field and enum here mirrors, verbatim, what the Halo app
 * (iraburyshemesh/demo-hello-app) sends to Pendo:
 *   - visitor / account metadata → src/pendo/pendoIdentity.ts
 *   - enum value sets            → src/auth/schemas.ts
 *   - track-event names          → src/pendo/track.ts (PENDO_TRACK_EVENTS)
 *
 * Keeping these aligned means the dataset drops straight into a Pendo demo
 * subscription (or into Halo's localStorage) without any field remapping.
 *
 * This file is the single source of truth for the dataset shape — the
 * generator (scripts/generate-usage-data.mjs) and every consumer type below
 * are derived from these const arrays.
 */

// ---------------------------------------------------------------------------
// Enums — mirror src/auth/schemas.ts in demo-hello-app
// ---------------------------------------------------------------------------

export const ROLES = [
  'Product',
  'Engineering',
  'Design',
  'Marketing',
  'Sales',
  'Operations',
  'Other',
] as const

export const COMPANY_SIZES = ['1–10', '11–50', '51–200', '201–1,000', '1,000+'] as const

export const INDUSTRIES = [
  'Software',
  'Financial services',
  'Healthcare',
  'Retail / e-commerce',
  'Manufacturing',
  'Education',
  'Other',
] as const

export const PLAN_TIERS = ['Free', 'Pro', 'Enterprise'] as const

export const PRIMARY_USE_CASES = [
  'Project management',
  'Task tracking',
  'Team coordination',
  'Personal productivity',
  'Just exploring',
] as const

export const TOP_GOALS = [
  'Ship faster',
  'Better visibility',
  'Less context switching',
  'Cleaner reporting',
  'Onboard the team',
  'Replace another tool',
] as const

export type Role = (typeof ROLES)[number]
export type CompanySize = (typeof COMPANY_SIZES)[number]
export type Industry = (typeof INDUSTRIES)[number]
export type PlanTier = (typeof PLAN_TIERS)[number]
export type PrimaryUseCase = (typeof PRIMARY_USE_CASES)[number]
export type TopGoal = (typeof TOP_GOALS)[number]

// ---------------------------------------------------------------------------
// Track-event names — mirror PENDO_TRACK_EVENTS in demo-hello-app/src/pendo/track.ts
// ---------------------------------------------------------------------------

export const TRACK_EVENTS = [
  // Signup wizard + sign-in
  'signup_step_completed',
  'signup_completed',
  'signup_failed',
  'signup_duplicate_account_detected',
  'user_signed_in',
  'user_sign_in_failed',
  // Lists
  'task_created',
  'task_updated',
  'task_completed',
  'task_reopened',
  'task_deleted',
  'task_filters_applied',
  // Reports
  'report_csv_exported',
  'report_filters_applied',
  // Team
  'teammate_invited',
  'teammate_role_changed',
  // Settings
  'profile_updated',
  'workspace_settings_updated',
  'plan_tier_changed',
  'demo_data_reset',
  // Help
  'help_search_performed',
  // Agent chat
  'ai_chat_message_sent',
  'ai_chat_response_received',
  'ai_chat_response_failed',
  'ai_chat_conversation_cleared',
] as const

export type TrackEventName = (typeof TRACK_EVENTS)[number]

/** Page paths visitors navigate — mirrors Halo's react-router routes. */
export const PAGE_PATHS = [
  '/app/dashboard',
  '/app/lists',
  '/app/reports',
  '/app/team',
  '/app/settings',
  '/app/help',
] as const

export type PagePath = (typeof PAGE_PATHS)[number]

// ---------------------------------------------------------------------------
// Record shapes
// ---------------------------------------------------------------------------

/** A Pendo account — in Halo, the account IS the workspace. */
export interface Account {
  id: string
  name: string
  companyName: string
  companySize: CompanySize
  industry: Industry
  planTier: PlanTier
  createdAt: string
}

/** A Pendo visitor — the signed-in Halo user, with their account link. */
export interface Visitor {
  id: string
  accountId: string
  email: string
  full_name: string
  firstName: string
  lastName: string
  username: string
  jobTitle: string
  role: Role
  yearsExperience: number
  location: string
  primaryUseCase: PrimaryUseCase
  teamSize: number
  topGoals: TopGoal[]
  createdAt: string
  signedInAt: string
}

/** A single usage event — a Pendo track event or a page view. */
export interface UsageEvent {
  visitorId: string
  accountId: string
  type: 'track' | 'page'
  /** TrackEventName for `track` events, PagePath for `page` events. */
  name: TrackEventName | PagePath
  timestamp: string
  properties: Record<string, string | number | boolean | null | string[]>
}

/** The full dataset, as shipped in src/data/*.json. */
export interface UsageDataset {
  accounts: Account[]
  visitors: Visitor[]
  events: UsageEvent[]
}
