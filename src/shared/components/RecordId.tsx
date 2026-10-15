interface RecordIdProps {
  /** The record's numeric id, as the API and the MCP readers use it. */
  id: number;
  /** What kind of record, for the hover title. e.g. "Message", "Handoff". */
  kind?: string;
  className?: string;
}

/**
 * A record's id, rendered so a person can actually read and quote it.
 *
 * WHY THIS IS A COMPONENT AND NOT A SPAN (2026-10-15)
 *
 * Franco: "the symbiosis admin ui does not show message numbers", and then, after I
 * fixed exactly that: "i think it was silly for you to add the message id for only
 * messages and not all other type of message."
 *
 * Both were scope problems, not markup problems. Commit 7613ded put an id on
 * messages and journals and nothing else, styled `text-text-tertiary/50` — #8a8a9a
 * at half opacity over the card background, a 2.08:1 contrast ratio where WCAG wants
 * 4.5:1 for body text and 3.0:1 even for large text. So two of five record types had
 * an id, and on those two it was painted and unreadable.
 *
 * Centralising it means the next record type gets a legible id by using this, and
 * the styling cannot drift back to half-opacity in one card while the others are
 * fine. Four separate spans is how the inconsistency happened in the first place.
 *
 * `select-all` matters more than it looks: the whole point of an id on screen is to
 * quote it into `message_read`, `handoff_read`, or a sentence to a sister. One click
 * selects the whole thing.
 */
export function RecordId({ id, kind, className = '' }: RecordIdProps) {
  return (
    <span
      className={`text-xs text-text-tertiary font-mono select-all ${className}`}
      title={kind ? `${kind} #${id}` : `#${id}`}
    >
      #{id}
    </span>
  );
}
