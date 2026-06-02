const EGYPT_ALIASES = new Set([
  'egypt', 'eg', 'egy', 'مصر', 'égypte', 'egypte',
]);

export function isEgypt(value: string | undefined): boolean {
  if (!value) return false;
  const normalised = value.trim().toLowerCase();
  if (!normalised) return false;
  return EGYPT_ALIASES.has(normalised);
}
