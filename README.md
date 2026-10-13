# Halo UI Kit

Shared [Mantine](https://mantine.dev)-based React component library **and** a
synthetic Pendo usage dataset for the Halo demo app
([`iraburyshemesh/demo-hello-app`](https://github.com/iraburyshemesh/demo-hello-app)).

Halo is a fake multi-tenant SaaS built for Pendo experimentation and demos. This
companion repo factors out the reusable UI primitives Halo (and future sibling
demo apps) share, and ships a prepopulated dataset of **visitors, accounts, and
usage events** so dashboards and demos have realistic data on first render.

## Install

```bash
npm install
npm run build        # emits dist/ (JS via Vite, .d.ts via tsc)
npm run typecheck
```

## Component library — `halo-ui-kit`

Components mirror Halo's conventions: the shared `haloTheme` (indigo, Inter, md
radius) and the `data-pendo-id` forwarding contract (PEN-07) so the Pendo agent
can target kit-rendered elements.

```tsx
import { MantineProvider } from '@mantine/core'
import { StatCard, UsageSparkline, PlanBadge, VisitorAvatar, Button, haloTheme } from 'halo-ui-kit'

<MantineProvider theme={haloTheme}>
  <StatCard label="Active visitors" value={42} delta={+8} pendoId="dashboard.kpi.active" />
</MantineProvider>
```

| Component | Purpose |
| --- | --- |
| `Button` | Mantine button with `pendoId` → `data-pendo-id` forwarding |
| `StatCard` | KPI tile (label, value, icon, period delta) |
| `PlanBadge` | Colour-coded Free / Pro / Enterprise badge |
| `VisitorAvatar` | Initials avatar, optional name + role |
| `UsageSparkline` | recharts area chart of daily usage volume |

## Usage dataset — `halo-ui-kit/data`

Typed access to the synthetic data in [`src/data`](src/data). Every field and
every event name mirrors exactly what Halo sends to Pendo (visitor/account
metadata from `src/pendo/pendoIdentity.ts`, enums from `src/auth/schemas.ts`,
and the `PENDO_TRACK_EVENTS` names from `src/pendo/track.ts`), so it drops into
a Pendo demo subscription — or Halo's localStorage — without remapping.

```ts
import { visitors, accounts, events, usageSummary, dailyEventVolume, trackEventCounts } from 'halo-ui-kit/data'

usageSummary()      // { accounts, visitors, events, trackEvents, pageViews }
dailyEventVolume()  // [{ date, count }, …] — ready for <UsageSparkline />
trackEventCounts()  // [{ name: 'task_created', count }, …] sorted desc
```

Selectors: `visitorsForAccount(id)`, `eventsForVisitor(id)`,
`eventsForAccount(id)`, `trackEventCounts()`, `dailyEventVolume()`,
`usageSummary()`.

### Regenerating the data

The dataset is deterministic — the generator is seeded, so re-running produces
byte-identical files. Bump the seed for a fresh cohort.

```bash
npm run generate:data              # default seed
node scripts/generate-usage-data.mjs --seed=99
```

See [`src/data/README.md`](src/data/README.md) for the full schema.
