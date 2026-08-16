import type { AgendaItem, AgendaTimeZoneMode } from './types';

export type { AgendaTimeZoneMode };

export function sortAgendaItems(items: AgendaItem[]): AgendaItem[] {
  return [...items].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );
}

export function formatAgendaTime(
  iso: string,
  timeZoneMode: AgendaTimeZoneMode = 'utc',
): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    ...(timeZoneMode === 'utc' ? { timeZone: 'UTC' } : {}),
  });
}

export function formatAgendaDayLabel(
  iso: string,
  timeZoneMode: AgendaTimeZoneMode = 'utc',
): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    ...(timeZoneMode === 'utc' ? { timeZone: 'UTC' } : {}),
  });
}

export function createAgendaItem(input: {
  title: string;
  startsAt: string;
}): AgendaItem {
  return {
    id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: input.title.trim(),
    startsAt: input.startsAt,
    done: false,
  };
}

export function toggleAgendaItemDone(
  items: AgendaItem[],
  id: string,
): AgendaItem[] {
  return items.map((item) =>
    item.id === id ? { ...item, done: !item.done } : item,
  );
}

export function withTimeOnSameUtcDay(
  dayIso: string,
  hours: number,
  minutes: number,
): string {
  const next = new Date(dayIso);
  next.setUTCHours(hours, minutes, 0, 0);
  return next.toISOString();
}

export function withTimeOnSameLocalDay(
  dayIso: string,
  hours: number,
  minutes: number,
): string {
  const next = new Date(dayIso);
  next.setHours(hours, minutes, 0, 0);
  return next.toISOString();
}

/** Build a Date whose wall clock matches the time we display for editing. */
export function toEditableClockDate(
  iso: string,
  timeZoneMode: AgendaTimeZoneMode = 'utc',
): Date {
  const source = new Date(iso);
  if (timeZoneMode === 'local') {
    return new Date(
      2000,
      0,
      1,
      source.getHours(),
      source.getMinutes(),
      0,
      0,
    );
  }
  return new Date(
    2000,
    0,
    1,
    source.getUTCHours(),
    source.getUTCMinutes(),
    0,
    0,
  );
}

export function fromEditableClockDate(
  dayIso: string,
  clock: Date,
  timeZoneMode: AgendaTimeZoneMode = 'utc',
): string {
  if (timeZoneMode === 'local') {
    return withTimeOnSameLocalDay(dayIso, clock.getHours(), clock.getMinutes());
  }
  return withTimeOnSameUtcDay(dayIso, clock.getHours(), clock.getMinutes());
}

export function setAgendaItemTime(
  items: AgendaItem[],
  id: string,
  startsAt: string,
): AgendaItem[] {
  return items.map((item) => (item.id === id ? { ...item, startsAt } : item));
}

export function getCompletedAgendaItems(items: AgendaItem[]): AgendaItem[] {
  return sortAgendaItems(items.filter((item) => item.done));
}

export function formatTimeZoneModeLabel(mode: AgendaTimeZoneMode): string {
  return mode === 'local' ? 'Local time' : 'UTC';
}

export function toggleTimeZoneMode(
  mode: AgendaTimeZoneMode,
): AgendaTimeZoneMode {
  return mode === 'local' ? 'utc' : 'local';
}
