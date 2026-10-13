/**
 * Pendo-id convention for halo-ui-kit, mirroring demo-hello-app's PEN-07 rule:
 * every interactive/trackable element carries a stable `data-pendo-id`
 * attribute that the Pendo agent attaches to for guide targeting and feature
 * tagging.
 *
 * The host app owns its own `PENDO_IDS` registry (a closed union there). A
 * shared library can't know those literals, so kit components accept a plain
 * namespaced string and forward it unchanged. Use `pendoAttr()` to build the
 * attribute object so the DOM key is spelled correctly in exactly one place.
 */
export type PendoId = string

/** Build the `data-pendo-id` attribute object (omitted entirely when absent). */
export function pendoAttr(pendoId?: PendoId): { 'data-pendo-id'?: PendoId } {
  return pendoId ? { 'data-pendo-id': pendoId } : {}
}
