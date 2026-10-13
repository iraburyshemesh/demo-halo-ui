/**
 * halo-ui-kit — shared Mantine component library for the Halo demo app.
 *
 * Components mirror demo-hello-app's conventions (brand theme + `data-pendo-id`
 * forwarding). The synthetic Pendo usage dataset is a separate entry point:
 *
 *   import { StatCard, UsageSparkline, haloTheme } from 'halo-ui-kit'
 *   import { visitors, usageSummary, dailyEventVolume } from 'halo-ui-kit/data'
 */
export { haloTheme } from './theme'
export { pendoAttr, type PendoId } from './pendo/pendoId'

export { Button, type ButtonProps } from './components/Button'
export { StatCard, type StatCardProps } from './components/StatCard'
export { PlanBadge, type PlanBadgeProps } from './components/PlanBadge'
export { VisitorAvatar, type VisitorAvatarProps } from './components/VisitorAvatar'
export {
  UsageSparkline,
  type UsageSparklineProps,
  type UsageTrendPoint,
} from './components/UsageSparkline'
