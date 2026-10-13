import { Badge, type BadgeProps } from '@mantine/core'
import type { PlanTier } from '../data/schema'
import { pendoAttr, type PendoId } from '../pendo/pendoId'

/** Brand colour per Halo plan tier. */
const PLAN_COLORS: Record<PlanTier, string> = {
  Free: 'gray',
  Pro: 'indigo',
  Enterprise: 'grape',
}

export type PlanBadgeProps = Omit<BadgeProps, 'color' | 'children'> & {
  plan: PlanTier
  pendoId?: PendoId
}

/** Colour-coded badge for an account's plan tier. */
export function PlanBadge({ plan, pendoId, variant = 'light', ...rest }: PlanBadgeProps) {
  return (
    <Badge color={PLAN_COLORS[plan]} variant={variant} {...pendoAttr(pendoId)} {...rest}>
      {plan}
    </Badge>
  )
}
