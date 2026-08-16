import type { AgendaItem } from './types';

export function sortAgendaItems(items: AgendaItem[]): AgendaItem[] {
  return [...items].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );
}

export function formatAgendaTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
  });
}

export function formatAgendaDayLabel(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
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

/** Build a local Date whose wall clock matches the UTC time we display. */
export function toEditableClockDate(iso: string): Date {
  const source = new Date(iso);
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

export function fromEditableClockDate(dayIso: string, clock: Date): string {
  return withTimeOnSameUtcDay(dayIso, clock.getHours(), clock.getMinutes());
}

export function setAgendaItemTime(
  items: AgendaItem[],
  id: string,
  startsAt: string,
): AgendaItem[] {
  return items.map((item) => (item.id === id ? { ...item, startsAt } : item));
}
