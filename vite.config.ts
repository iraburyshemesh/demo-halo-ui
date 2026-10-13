import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const projectRoot = dirname(fileURLToPath(import.meta.url))

/**
 * Library build for halo-ui-kit.
 *
 * Two entry points mirror package.json `exports`:
 *   - `.`      → the component library (src/index.ts)
 *   - `./data` → the synthetic Pendo usage dataset (src/data/index.ts)
 *
 * React / React-DOM / Mantine are externalized so the kit shares the host
 * app's single React + Mantine instance (required for context/hooks to work).
 * `.d.ts` files are emitted separately by `tsc -p tsconfig.build.json`.
 */
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: {
        index: resolve(projectRoot, 'src/index.ts'),
        'data/index': resolve(projectRoot, 'src/data/index.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        /^@mantine\//,
        /^@tabler\//,
        'recharts',
      ],
    },
  },
})
