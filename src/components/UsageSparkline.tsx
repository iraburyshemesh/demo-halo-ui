import { useMantineTheme } from '@mantine/core'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { pendoAttr, type PendoId } from '../pendo/pendoId'

export type UsageTrendPoint = { date: string; count: number }

export type UsageSparklineProps = {
  /** Daily volume series — pass `dailyEventVolume()` from `halo-ui-kit/data`. */
  data: UsageTrendPoint[]
  height?: number
  /** Render X/Y axes and a tooltip (off by default for a true sparkline). */
  withAxes?: boolean
  pendoId?: PendoId
}

/**
 * Minimal area chart of usage over time, built on recharts (the same chart lib
 * demo-hello-app uses). Pairs directly with the dataset's `dailyEventVolume()`
 * selector to visualise the prepopulated visitor activity.
 */
export function UsageSparkline({ data, height = 60, withAxes = false, pendoId }: UsageSparklineProps) {
  const theme = useMantineTheme()
  const stroke = theme.colors.indigo[6]

  return (
    <div {...pendoAttr(pendoId)} style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="halo-usage-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.35} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          {withAxes && <XAxis dataKey="date" fontSize={11} tickLine={false} />}
          {withAxes && <YAxis fontSize={11} tickLine={false} width={28} allowDecimals={false} />}
          {withAxes && <Tooltip />}
          <Area
            type="monotone"
            dataKey="count"
            stroke={stroke}
            strokeWidth={2}
            fill="url(#halo-usage-fill)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
