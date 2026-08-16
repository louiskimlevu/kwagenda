import {
  DUE_REMINDER_LEAD_MS,
  buildDueReminderContent,
  dueReminderNotificationId,
  getDueReminderAt,
  shouldScheduleDueReminder,
} from '../src/notifications/dueReminders';
import type { AgendaItem } from '../src/agenda/types';

describe('dueReminders', () => {
  const item: AgendaItem = {
    id: 'task-1',
    title: 'Tea under the peonies',
    startsAt: '2026-08-16T15:30:00.000Z',
    done: false,
  };

  it('uses a 10-minute lead before the task is due', () => {
    expect(DUE_REMINDER_LEAD_MS).toBe(10 * 60 * 1000);
  });

  it('computes the reminder fire time 10 minutes before startsAt', () => {
    expect(getDueReminderAt(item.startsAt).toISOString()).toBe(
      '2026-08-16T15:20:00.000Z',
    );
  });

  it('schedules only incomplete tasks whose reminder is still in the future', () => {
    const now = new Date('2026-08-16T15:00:00.000Z');
    expect(shouldScheduleDueReminder(item, now)).toBe(true);
    expect(
      shouldScheduleDueReminder({ ...item, done: true }, now),
    ).toBe(false);
    expect(
      shouldScheduleDueReminder(
        item,
        new Date('2026-08-16T15:25:00.000Z'),
      ),
    ).toBe(false);
  });

  it('builds notification copy for an upcoming task', () => {
    expect(buildDueReminderContent(item)).toEqual({
      title: 'Coming up in 10 minutes',
      body: 'Tea under the peonies',
      data: { agendaItemId: 'task-1' },
    });
  });

  it('uses a stable notification id per agenda item', () => {
    expect(dueReminderNotificationId(item.id)).toBe('due-reminder:task-1');
  });
});
