import { Group, Paper, type PaperProps, Text, ThemeIcon } from '@mantine/core'
import type { Icon } from '@tabler/icons-react'
import { pendoAttr, type PendoId } from '../pendo/pendoId'

export type StatCardProps = Omit<PaperProps, 'children'> & {
  label: string
  value: string | number
  /** Optional Tabler icon component, e.g. `IconUsers`. */
  icon?: Icon
  /** Signed delta vs. previous period, e.g. +12 or -3. Coloured automatically. */
  delta?: number
  pendoId?: PendoId
}

/**
 * Compact KPI tile for dashboards — pairs a headline metric with a label,
 * an optional icon, and an optional period-over-period delta. Reads naturally
 * from the usageSummary() selector in `halo-ui-kit/data`.
 */
export function StatCard({
  label,
  value,
  icon: IconComponent,
  delta,
  pendoId,
  withBorder = true,
  radius = 'md',
  p = 'lg',
  ...rest
}: StatCardProps) {
  const deltaColor = delta === undefined || delta === 0 ? 'dimmed' : delta > 0 ? 'teal' : 'red'

  return (
    <Paper withBorder={withBorder} radius={radius} p={p} {...pendoAttr(pendoId)} {...rest}>
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <div>
          <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
            {label}
          </Text>
          <Text size="xl" fw={700} mt={4}>
            {value}
          </Text>
          {delta !== undefined && (
            <Text size="sm" c={deltaColor} mt={2}>
              {delta > 0 ? `+${delta}` : delta} vs. last period
            </Text>
          )}
        </div>
        {IconComponent && (
          <ThemeIcon variant="light" color="indigo" size="lg" radius="md">
            <IconComponent size={20} />
          </ThemeIcon>
        )}
      </Group>
    </Paper>
  )
}
