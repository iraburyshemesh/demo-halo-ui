import { Avatar, type AvatarProps, Group, Stack, Text } from '@mantine/core'
import type { Visitor } from '../data/schema'
import { pendoAttr, type PendoId } from '../pendo/pendoId'

/** Initials fallback from a visitor's full name, e.g. "Ada Lovelace" → "AL". */
function initials(fullName: string): string {
  return fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export type VisitorAvatarProps = {
  visitor: Pick<Visitor, 'full_name' | 'role'>
  /** Show name + role beside the avatar. */
  withDetails?: boolean
  size?: AvatarProps['size']
  pendoId?: PendoId
}

/** Avatar (initials) for a visitor, optionally with their name and role. */
export function VisitorAvatar({ visitor, withDetails = false, size = 'md', pendoId }: VisitorAvatarProps) {
  const avatar = (
    <Avatar color="indigo" radius="xl" size={size} {...pendoAttr(pendoId)}>
      {initials(visitor.full_name)}
    </Avatar>
  )

  if (!withDetails) return avatar

  return (
    <Group gap="sm" wrap="nowrap">
      {avatar}
      <Stack gap={0}>
        <Text size="sm" fw={600}>
          {visitor.full_name}
        </Text>
        <Text size="xs" c="dimmed">
          {visitor.role}
        </Text>
      </Stack>
    </Group>
  )
}
