import type { AgendaItem } from '../agenda/types';

export const DUE_REMINDER_LEAD_MS = 10 * 60 * 1000;

export function getDueReminderAt(startsAt: string): Date {
  return new Date(new Date(startsAt).getTime() - DUE_REMINDER_LEAD_MS);
}

export function shouldScheduleDueReminder(
  item: AgendaItem,
  now: Date,
): boolean {
  if (item.done) {
    return false;
  }
  return getDueReminderAt(item.startsAt).getTime() > now.getTime();
}

export function buildDueReminderContent(item: AgendaItem): {
  title: string;
  body: string;
  data: { agendaItemId: string };
} {
  return {
    title: 'Coming up in 10 minutes',
    body: item.title,
    data: { agendaItemId: item.id },
  };
}

export function dueReminderNotificationId(itemId: string): string {
  return `due-reminder:${itemId}`;
}
