import {
  createAgendaItem,
  formatAgendaDayLabel,
  formatAgendaTime,
  formatTimeZoneModeLabel,
  fromEditableClockDate,
  getCompletedAgendaItems,
  setAgendaItemTime,
  sortAgendaItems,
  toEditableClockDate,
  toggleAgendaItemDone,
  toggleTimeZoneMode,
  withTimeOnSameLocalDay,
  withTimeOnSameUtcDay,
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

  it('formats a readable UTC time for an agenda slot', () => {
    expect(formatAgendaTime('2026-08-16T08:30:00.000Z', 'utc')).toMatch(/8:30/);
  });

  it('formats a readable local time for an agenda slot', () => {
    const iso = '2026-08-16T08:30:00.000Z';
    expect(formatAgendaTime(iso, 'local')).toBe(
      new Date(iso).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      }),
    );
  });

  it('formats a floral day label for the agenda header in UTC or local', () => {
    expect(formatAgendaDayLabel('2026-08-16T12:00:00.000Z', 'utc')).toMatch(
      /August 16/,
    );
    const iso = '2026-08-16T12:00:00.000Z';
    expect(formatAgendaDayLabel(iso, 'local')).toBe(
      new Date(iso).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
      }),
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

  it('keeps the UTC day when applying a new clock time', () => {
    expect(withTimeOnSameUtcDay('2026-08-16T08:30:00.000Z', 15, 45)).toBe(
      '2026-08-16T15:45:00.000Z',
    );
  });

  it('applies clock time on the local calendar day', () => {
    const dayIso = '2026-08-16T12:00:00.000Z';
    const expected = new Date(dayIso);
    expected.setHours(15, 45, 0, 0);
    expect(withTimeOnSameLocalDay(dayIso, 15, 45)).toBe(expected.toISOString());
  });

  it('maps displayed UTC clock times into a local picker date and back', () => {
    const clock = toEditableClockDate('2026-08-16T08:30:00.000Z', 'utc');
    expect(clock.getHours()).toBe(8);
    expect(clock.getMinutes()).toBe(30);
    expect(
      fromEditableClockDate('2026-08-16T08:30:00.000Z', clock, 'utc'),
    ).toBe('2026-08-16T08:30:00.000Z');
  });

  it('maps displayed local clock times into a picker date and back', () => {
    const iso = '2026-08-16T08:30:00.000Z';
    const clock = toEditableClockDate(iso, 'local');
    const source = new Date(iso);
    expect(clock.getHours()).toBe(source.getHours());
    expect(clock.getMinutes()).toBe(source.getMinutes());
    expect(fromEditableClockDate(iso, clock, 'local')).toBe(
      withTimeOnSameLocalDay(iso, clock.getHours(), clock.getMinutes()),
    );
  });

  it('updates an item start time by id', () => {
    const items = [base, { ...base, id: 'b', title: 'Tea' }];
    const next = setAgendaItemTime(items, 'a', '2026-08-16T09:15:00.000Z');
    expect(next.find((i) => i.id === 'a')?.startsAt).toBe(
      '2026-08-16T09:15:00.000Z',
    );
    expect(next.find((i) => i.id === 'b')?.startsAt).toBe(base.startsAt);
  });

  it('returns completed items sorted by start time', () => {
    const items: AgendaItem[] = [
      { ...base, id: 'open', done: false },
      {
        ...base,
        id: 'late',
        title: 'Tea',
        startsAt: '2026-08-16T15:00:00.000Z',
        done: true,
      },
      {
        ...base,
        id: 'early',
        title: 'Walk',
        startsAt: '2026-08-16T07:00:00.000Z',
        done: true,
      },
    ];
    expect(getCompletedAgendaItems(items).map((i) => i.id)).toEqual([
      'early',
      'late',
    ]);
  });

  it('labels and toggles the timezone mode', () => {
    expect(formatTimeZoneModeLabel('local')).toBe('Local time');
    expect(formatTimeZoneModeLabel('utc')).toBe('UTC');
    expect(toggleTimeZoneMode('local')).toBe('utc');
    expect(toggleTimeZoneMode('utc')).toBe('local');
  });
});
