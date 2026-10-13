import { createTheme, type MantineThemeOverride } from '@mantine/core'

/**
 * Halo brand theme — identical tokens to demo-hello-app/src/theme.ts so the
 * kit's components render on-brand inside the Halo app (and any sibling demo
 * app) without extra wiring. Pass it to the host's `<MantineProvider>`.
 */
export const haloTheme: MantineThemeOverride = createTheme({
  primaryColor: 'indigo',
  defaultRadius: 'md',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
})
