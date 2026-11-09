/**
 * Editorial line breaking for display headings.
 *
 * CJK breaks anywhere by default, so a browser will happily split a word across
 * two lines ("…作 / 品仍在…"). For large display type we break on clauses
 * instead — after a comma or a full stop — which is what an editor would do.
 * Each returned line should be rendered as its own block.
 */
export function splitHeading(text: string): string[] {
  const parts = text
    .split(/(?<=[，。！？；：])|(?<=[.!?;:])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
  return parts.length > 1 ? parts : [text]
}
