import { Button as MantineButton, type ButtonProps as MantineButtonProps } from '@mantine/core'
import { pendoAttr, type PendoId } from '../pendo/pendoId'

/**
 * Halo Button — wraps Mantine's Button and forwards a `pendoId` as the
 * `data-pendo-id` DOM attribute, mirroring demo-hello-app's primitive
 * convention. Unlike the host app's closed `PendoId` union, the shared kit
 * accepts any namespaced string so consuming apps supply their own ids.
 */
export type ButtonProps = MantineButtonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof MantineButtonProps> & {
    pendoId?: PendoId
    children: React.ReactNode
  }

export function Button({ pendoId, ...rest }: ButtonProps) {
  return <MantineButton {...pendoAttr(pendoId)} {...rest} />
}
