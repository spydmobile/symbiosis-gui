/**
 * EVERY record type the UI displays must show its id — not just messages.
 *
 * Franco, 2026-10-15: "i think it was silly for you to add the message id for only
 * messages and not all other type of message."
 *
 * He is right, and the scope error was inherited rather than chosen. Commit 7613ded
 * ("Show IDs on journals/messages") covered exactly two entity types, and when I
 * fixed the contrast I fixed the two that already had the markup instead of asking
 * which records a person needs to refer to. The answer is all of them: an id is how
 * you quote a record back, how `message_read`/`handoff_read` fetch one, and how two
 * people name the same row. A UI that shows ids for two of five types is not showing
 * ids, it is showing them inconsistently.
 *
 * Measured gaps at the time of writing: Handoff (id: number) and SearchResult
 * (id: number) rendered no id at all. SMEKB has an id too, but its backend has been
 * dead since ~2026-03 and its tools were retired on 2026-10-02 — that page is a
 * stale artifact to resolve, not one to decorate, so it is deliberately excluded
 * here and reported instead.
 */
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { HandoffCard } from '../handoffs/HandoffCard';
import { SearchResults } from '../search/SearchResults';
import type { Handoff } from '../../domain/entities';

const handoff: Handoff = {
  id: 1213,
  unicorn: 'Circuit',
  focus: 'Gmail for all unicorns',
  summary: 'read-only token minted',
  next_steps: 'wire the thirteen workspaces',
  notes: null,
  timestamp: '2026-10-15T08:26:00Z',
};

describe('every displayed record shows its id', () => {
  it('CONTROL: the id query can fail — a number that is not rendered is not found', () => {
    render(<HandoffCard handoff={handoff} />);
    expect(screen.queryByText(/#999999/)).toBeNull();
  });

  it('HandoffCard shows the handoff id', () => {
    // handoff_read(id) is how a sister fetches one. Without the id on screen there
    // is no way to name the handoff you are looking at.
    render(<HandoffCard handoff={handoff} />);
    expect(screen.getByText(/#1213/), 'handoff id is not rendered').toBeTruthy();
  });

  it('HandoffCard id is not dimmed by an opacity modifier', () => {
    const { container } = render(<HandoffCard handoff={handoff} />);
    const el = Array.from(container.querySelectorAll('*')).find(
      (n) => n.textContent?.trim() === '#1213' && n.children.length === 0
    );
    expect(el, 'no element contains exactly "#1213"').toBeTruthy();
    expect(el!.className).not.toMatch(/\/\d{1,2}\b/);
  });

  it('SearchResults shows an id for every result type it renders', () => {
    // A search result is where the id matters most: you find a thing, then you need
    // to go read it, and message_read/handoff_read take an id.
    const response = {
      query: 'controls',
      results: {
        messages: {
          count: 1,
          items: [{
            id: 1897, from_entity: 'Franco', to_entity: 'Circuit', subject: 'four questions',
            body: 'x', timestamp: '2026-10-15T08:00:00Z', read: true,
            delivered_via: 'db' as const, reply_to: null,
          }],
        },
        handoffs: {
          count: 1,
          items: [{
            id: 1213, unicorn: 'Circuit', focus: 'Gmail', summary: 's',
            next_steps: 'n', notes: null, timestamp: '2026-10-15T08:00:00Z',
          }],
        },
      },
    };
    render(
      <MemoryRouter>
        <SearchResults results={response as never} sortBy={'date' as never} sortOrder={'desc' as never} />
      </MemoryRouter>
    );
    expect(screen.getByText(/#1897/), 'message search result shows no id').toBeTruthy();
    expect(screen.getByText(/#1213/), 'handoff search result shows no id').toBeTruthy();
  });
});
