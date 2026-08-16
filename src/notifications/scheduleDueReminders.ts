import * as Notifications from 'expo-notifications';
import type { AgendaItem } from '../agenda/types';
import {
  buildDueReminderContent,
  dueReminderNotificationId,
  getDueReminderAt,
  shouldScheduleDueReminder,
} from './dueReminders';

async function ensureNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted || current.status === 'granted') {
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync();
  return Boolean(requested.granted || requested.status === 'granted');
}

/**
 * Replace scheduled due reminders so they match open agenda items.
 * Reminders fire 10 minutes before each incomplete task; the OS only surfaces
 * them when the app is backgrounded (foreground alerts are suppressed).
 */
export async function syncDueReminders(
  items: AgendaItem[],
  now: Date = new Date(),
): Promise<void> {
  const allowed = await ensureNotificationPermission();
  if (!allowed) {
    return;
  }

  await Notifications.cancelAllScheduledNotificationsAsync();

  const upcoming = items.filter((item) => shouldScheduleDueReminder(item, now));
  await Promise.all(
    upcoming.map((item) => {
      const content = buildDueReminderContent(item);
      return Notifications.scheduleNotificationAsync({
        identifier: dueReminderNotificationId(item.id),
        content: {
          ...content,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: getDueReminderAt(item.startsAt),
        },
      });
    }),
  );
}

/** Suppress banners while the user is actively in the app. */
export function configureDueReminderForegroundBehavior(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: false,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: false,
      shouldShowList: false,
    }),
  });
}
