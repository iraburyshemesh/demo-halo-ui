/**
 * Synthetic Pendo usage-data generator for the Halo demo app.
 *
 * Produces three JSON files under src/data/ — accounts.json, visitors.json,
 * events.json — whose shapes mirror exactly what demo-hello-app sends to Pendo
 * (see src/data/schema.ts for the field-by-field provenance).
 *
 * Deterministic: faker is seeded with a fixed value so re-running regenerates
 * byte-identical data. Bump SEED (or pass `--seed=<n>`) to roll a fresh cohort.
 *
 *   node scripts/generate-usage-data.mjs
 *   node scripts/generate-usage-data.mjs --seed=99
 */
import { faker } from '@faker-js/faker'
import { randomUUID } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = resolve(HERE, '..', 'src', 'data')

// Enum sets — kept in lockstep with src/data/schema.ts.
const ROLES = ['Product', 'Engineering', 'Design', 'Marketing', 'Sales', 'Operations', 'Other']
const COMPANY_SIZES = ['1–10', '11–50', '51–200', '201–1,000', '1,000+']
const INDUSTRIES = [
  'Software',
  'Financial services',
  'Healthcare',
  'Retail / e-commerce',
  'Manufacturing',
  'Education',
  'Other',
]
const PLAN_TIERS = ['Free', 'Pro', 'Enterprise']
const PRIMARY_USE_CASES = [
  'Project management',
  'Task tracking',
  'Team coordination',
  'Personal productivity',
  'Just exploring',
]
const TOP_GOALS = [
  'Ship faster',
  'Better visibility',
  'Less context switching',
  'Cleaner reporting',
  'Onboard the team',
  'Replace another tool',
]
const TASK_PRIORITIES = ['low', 'medium', 'high', 'urgent']
const TASK_STATUSES = ['todo', 'in_progress', 'blocked', 'done']
const WORKSPACE_ROLES = ['Admin', 'Member', 'Viewer']

const PAGE_PATHS = [
  '/app/dashboard',
  '/app/lists',
  '/app/reports',
  '/app/team',
  '/app/settings',
  '/app/help',
]

/**
 * Per-track-event property builders. Payloads mirror the real emitters in
 * demo-hello-app (notably src/tasks/taskTrackProperties.ts) and never carry
 * PII or free-text — matching Halo's track() property rules.
 */
const EVENT_PROPERTY_BUILDERS = {
  signup_step_completed: () => ({ step: faker.number.int({ min: 1, max: 4 }) }),
  signup_completed: () => ({ planTier: faker.helpers.arrayElement(PLAN_TIERS) }),
  signup_failed: () => ({ reason: faker.helpers.arrayElement(['validation', 'duplicate']) }),
  signup_duplicate_account_detected: () => ({ field: 'email' }),
  user_signed_in: () => ({ method: 'password' }),
  user_sign_in_failed: () => ({ reason: 'credential_mismatch' }),
  task_created: () => ({
    priority: faker.helpers.arrayElement(TASK_PRIORITIES),
    hasDueDate: faker.datatype.boolean(),
    assigneeIsSelf: faker.datatype.boolean(),
  }),
  task_updated: () => ({ fieldsChanged: faker.number.int({ min: 1, max: 4 }) }),
  task_completed: () => ({
    priority: faker.helpers.arrayElement(TASK_PRIORITIES),
    completionMethod: faker.helpers.arrayElement(['checkbox', 'edit_modal']),
    wasOverdue: faker.datatype.boolean(),
    cycleTimeDays: Number(faker.number.float({ min: 0, max: 21, fractionDigits: 1 })),
    assigneeIsSelf: faker.datatype.boolean(),
  }),
  task_reopened: () => ({
    priority: faker.helpers.arrayElement(TASK_PRIORITIES),
    reopenMethod: faker.helpers.arrayElement(['checkbox', 'edit_modal']),
    minutesSinceCompleted: Number(faker.number.float({ min: 0, max: 4320, fractionDigits: 1 })),
  }),
  task_deleted: () => ({ status: faker.helpers.arrayElement(TASK_STATUSES) }),
  task_filters_applied: () => ({
    assigneeScope: faker.helpers.arrayElement(['all', 'self', 'teammate']),
    status: faker.helpers.arrayElement([...TASK_STATUSES, 'all']),
    priority: faker.helpers.arrayElement([...TASK_PRIORITIES, 'all']),
  }),
  report_csv_exported: () => ({ rowCount: faker.number.int({ min: 1, max: 400 }) }),
  report_filters_applied: () => ({ rangeDays: faker.helpers.arrayElement([7, 14, 30, 90]) }),
  teammate_invited: () => ({ role: faker.helpers.arrayElement(WORKSPACE_ROLES) }),
  teammate_role_changed: () => ({
    from: faker.helpers.arrayElement(WORKSPACE_ROLES),
    to: faker.helpers.arrayElement(WORKSPACE_ROLES),
  }),
  profile_updated: () => ({ fieldsChanged: faker.number.int({ min: 1, max: 5 }) }),
  workspace_settings_updated: () => ({ fieldsChanged: faker.number.int({ min: 1, max: 4 }) }),
  plan_tier_changed: () => ({
    from: faker.helpers.arrayElement(PLAN_TIERS),
    to: faker.helpers.arrayElement(PLAN_TIERS),
  }),
  demo_data_reset: () => ({}),
  help_search_performed: () => ({ queryLength: faker.number.int({ min: 2, max: 40 }) }),
  ai_chat_message_sent: () => ({ messageLength: faker.number.int({ min: 3, max: 500 }) }),
  ai_chat_response_received: () => ({ latencyMs: faker.number.int({ min: 400, max: 9000 }) }),
  ai_chat_response_failed: () => ({ reason: faker.helpers.arrayElement(['timeout', 'api_error']) }),
  ai_chat_conversation_cleared: () => ({ messageCount: faker.number.int({ min: 1, max: 40 }) }),
}

/** Weighted track events — mimics a real product's long-tail of activity. */
const WEIGHTED_TRACK_EVENTS = [
  ...Array(10).fill('task_created'),
  ...Array(9).fill('task_completed'),
  ...Array(5).fill('task_updated'),
  ...Array(4).fill('task_filters_applied'),
  ...Array(3).fill('task_reopened'),
  ...Array(3).fill('task_deleted'),
  ...Array(4).fill('report_filters_applied'),
  ...Array(2).fill('report_csv_exported'),
  ...Array(3).fill('ai_chat_message_sent'),
  ...Array(3).fill('ai_chat_response_received'),
  ...Array(2).fill('help_search_performed'),
  ...Array(2).fill('profile_updated'),
  ...Array(1).fill('workspace_settings_updated'),
  ...Array(1).fill('teammate_invited'),
  ...Array(1).fill('teammate_role_changed'),
  ...Array(1).fill('plan_tier_changed'),
  ...Array(1).fill('ai_chat_response_failed'),
  ...Array(1).fill('ai_chat_conversation_cleared'),
]

function parseSeed() {
  const arg = process.argv.find((a) => a.startsWith('--seed='))
  return arg ? Number(arg.split('=')[1]) : 20260101
}

function buildAccount() {
  const companyName = faker.company.name()
  const createdAt = faker.date.past({ years: 2 })
  return {
    id: randomUUID(),
    name: companyName,
    companyName,
    companySize: faker.helpers.arrayElement(COMPANY_SIZES),
    industry: faker.helpers.arrayElement(INDUSTRIES),
    planTier: faker.helpers.weightedArrayElement([
      { value: 'Free', weight: 5 },
      { value: 'Pro', weight: 3 },
      { value: 'Enterprise', weight: 2 },
    ]),
    createdAt: createdAt.toISOString(),
  }
}

function buildVisitor(account) {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  // Visitor joined after their account was created, and signed in since.
  const createdAt = faker.date.between({ from: account.createdAt, to: new Date() })
  const signedInAt = faker.date.between({ from: createdAt, to: new Date() })
  return {
    id: randomUUID(),
    accountId: account.id,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    full_name: `${firstName} ${lastName}`,
    firstName,
    lastName,
    username: faker.internet.username({ firstName, lastName }).toLowerCase(),
    jobTitle: faker.person.jobTitle(),
    role: faker.helpers.arrayElement(ROLES),
    yearsExperience: faker.number.int({ min: 0, max: 30 }),
    location: `${faker.location.city()}, ${faker.location.country()}`,
    primaryUseCase: faker.helpers.arrayElement(PRIMARY_USE_CASES),
    teamSize: faker.number.int({ min: 1, max: 250 }),
    topGoals: faker.helpers.arrayElements(TOP_GOALS, { min: 1, max: 3 }),
    createdAt: createdAt.toISOString(),
    signedInAt: signedInAt.toISOString(),
  }
}

function buildEvents(visitor) {
  const events = []
  const activityLevel = faker.number.int({ min: 8, max: 60 })

  for (let i = 0; i < activityLevel; i += 1) {
    // Events happen after the visitor joined, within the last 90 days.
    const earliest = Math.max(
      new Date(visitor.createdAt).getTime(),
      Date.now() - 90 * 86_400_000,
    )
    const timestamp = faker.date.between({ from: new Date(earliest), to: new Date() })

    const isPageView = faker.datatype.boolean({ probability: 0.4 })
    if (isPageView) {
      events.push({
        visitorId: visitor.id,
        accountId: visitor.accountId,
        type: 'page',
        name: faker.helpers.arrayElement(PAGE_PATHS),
        timestamp: timestamp.toISOString(),
        properties: {},
      })
    } else {
      const name = faker.helpers.arrayElement(WEIGHTED_TRACK_EVENTS)
      events.push({
        visitorId: visitor.id,
        accountId: visitor.accountId,
        type: 'track',
        name,
        timestamp: timestamp.toISOString(),
        properties: EVENT_PROPERTY_BUILDERS[name](),
      })
    }
  }
  return events
}

function writeJson(fileName, value) {
  const target = resolve(DATA_DIR, fileName)
  writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`)
  return target
}

function main() {
  const seed = parseSeed()
  faker.seed(seed)
  mkdirSync(DATA_DIR, { recursive: true })

  const accountCount = 8
  const accounts = Array.from({ length: accountCount }, buildAccount)

  const visitors = []
  for (const account of accounts) {
    const visitorCount = faker.number.int({ min: 3, max: 8 })
    for (let i = 0; i < visitorCount; i += 1) {
      visitors.push(buildVisitor(account))
    }
  }

  const events = visitors
    .flatMap(buildEvents)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp))

  writeJson('accounts.json', accounts)
  writeJson('visitors.json', visitors)
  writeJson('events.json', events)

  console.log(
    `[halo-ui-kit] generated (seed=${seed}): ` +
      `${accounts.length} accounts, ${visitors.length} visitors, ${events.length} events`,
  )
}

main()
