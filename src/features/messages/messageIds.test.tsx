/**
 * Message numbers must be VISIBLE in the admin UI.
 *
 * Franco's bug report, 2026-10-15: "the symbiosis admin ui does not show message numbers."
 *
 * He was right, and the cause was not missing code. `MessageCard` has rendered
 * `#{message.id}` since 7613ded (2025-12-30) and the deployed image was built
 * 2026-02-14, so the markup has shipped for eight months. Two things hide it:
 *
 *   1. It is styled `text-text-tertiary/50` — #8a8a9a at 50% opacity over the card
 *      background, which computes to #5a5a6a and a contrast ratio of 2.08:1. WCAG
 *      wants 4.5:1 for body text and 3.0:1 even for large text. Dropping the /50
 *      gives 4.15:1. So the number was on screen and not legible.
 *   2. It only appears INSIDE an expanded thread. The collapsed thread header — what
 *      you see scanning the inbox — shows subject, participants, a message count and
 *      a relative time, and no id anywhere. So without expanding every thread there
 *      is no number on the page at all.
 *
 * "Rendered" and "visible" are different claims, and only the first was ever true.
 * These tests assert the second.
 */
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MessageCard } from './MessageCard';
import { ThreadView } from './ThreadView';
import type { Message, MessageThread } from '../../domain/entities';

const message = (id: number, over: Partial<Message> = {}): Message => ({
  id,
  from_entity: 'Franco',
  to_entity: 'Circuit',
  subject: 'Four questions',
  body: 'body text',
  timestamp: '2026-10-15T08:00:00Z',
  read: true,
  delivered_via: 'db',
  reply_to: null,
  ...over,
});

const thread = (ids: number[]): MessageThread => ({
  id: 'thread-1',
  subject: 'Four questions',
  participants: ['Franco', 'Circuit'],
  messages: ids.map((i) => message(i)),
  lastActivity: '2026-10-15T08:00:00Z',
  unreadCount: 0,
});

describe('message numbers are visible', () => {
  it('CONTROL: the id query finds a number that IS rendered', () => {
    // If this fails, every assertion below is measuring a broken query rather
    // than the UI. A detector needs a known positive.
    render(<MessageCard message={message(1897)} />);
    expect(screen.getByText(/#1897/)).toBeTruthy();
  });

  it('renders the id in a legible colour, not half-opacity tertiary', () => {
    const { container } = render(<MessageCard message={message(1897)} />);
    const el = Array.from(container.querySelectorAll('*')).find((n) =>
      n.textContent?.trim() === '#1897' && n.children.length === 0
    );
    expect(el, 'no element contains exactly "#1897"').toBeTruthy();
    const cls = el!.className;
    // 2.08:1 contrast. The number is painted and cannot be read.
    expect(cls, `id element must not be dimmed by an opacity modifier: "${cls}"`)
      .not.toMatch(/\/\d{1,2}\b/);
  });

  it('shows the message number on the COLLAPSED thread header', () => {
    // The inbox view. Without this, no number is on screen until every thread
    // is expanded one by one.
    render(<ThreadView thread={thread([1895, 1896, 1897])} />);
    expect(
      screen.getByText(/#1897/),
      'collapsed thread header shows no message id'
    ).toBeTruthy();
  });

  it('shows the id for every message once the thread is expanded', () => {
    render(<ThreadView thread={thread([1895, 1896, 1897])} defaultExpanded />);
    for (const id of [1895, 1896, 1897]) {
      // getAllByText, not getByText: the newest id now appears twice by design —
      // once in the collapsed-header position and once on its own card. getByText
      // throws on multiple matches, so the strict query would fail the FIX rather
      // than the bug.
      expect(
        screen.getAllByText(new RegExp(`#${id}`)).length,
        `missing #${id}`
      ).toBeGreaterThan(0);
    }
    // And the newest one is the duplicated one, which is the intended shape.
    expect(screen.getAllByText(/#1897/).length).toBe(2);
    expect(screen.getAllByText(/#1895/).length).toBe(1);
  });

  it('keeps the id visible in compact mode, which is how threads render it', () => {
    // ThreadView passes compact, and compact hides the subject. The id must not
    // be a casualty of that.
    render(<MessageCard message={message(1897)} compact />);
    expect(screen.getByText(/#1897/)).toBeTruthy();
  });
});
