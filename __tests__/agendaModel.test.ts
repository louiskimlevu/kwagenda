import {
  createAgendaItem,
  formatAgendaDayLabel,
  formatAgendaTime,
  sortAgendaItems,
  toggleAgendaItemDone,
} from '../src/agenda/agendaModel';
import type { AgendaItem } from '../src/agenda/types';

describe('agendaModel', () => {
  const base: AgendaItem = {
    id: 'a',
    title: 'Morning walk',
    startsAt: '2026-08-16T08:30:00.000Z',
    done: false,
  };

  it('sorts items by start time ascending', () => {
    const later = { ...base, id: 'b', startsAt: '2026-08-16T10:00:00.000Z' };
    const earlier = { ...base, id: 'c', startsAt: '2026-08-16T07:00:00.000Z' };
    expect(sortAgendaItems([later, base, earlier]).map((i) => i.id)).toEqual([
      'c',
      'a',
      'b',
    ]);
  });

  it('formats a readable time for an agenda slot', () => {
    expect(formatAgendaTime('2026-08-16T08:30:00.000Z')).toMatch(/8:30/);
  });

  it('formats a floral day label for the agenda header', () => {
    expect(formatAgendaDayLabel('2026-08-16T12:00:00.000Z')).toMatch(
      /August 16/,
    );
  });

  it('creates a new agenda item with a title and start time', () => {
    const item = createAgendaItem({
      title: '  Water the roses  ',
      startsAt: '2026-08-16T15:00:00.000Z',
    });
    expect(item.title).toBe('Water the roses');
    expect(item.startsAt).toBe('2026-08-16T15:00:00.000Z');
    expect(item.done).toBe(false);
    expect(item.id).toBeTruthy();
  });

  it('toggles done state for an item by id', () => {
    const items = [base, { ...base, id: 'b', title: 'Tea' }];
    const next = toggleAgendaItemDone(items, 'a');
    expect(next.find((i) => i.id === 'a')?.done).toBe(true);
    expect(next.find((i) => i.id === 'b')?.done).toBe(false);
  });
});
