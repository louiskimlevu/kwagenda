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
