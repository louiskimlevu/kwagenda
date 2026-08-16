import type { AgendaItem } from '../src/agenda/types';
import { syncDueReminders } from '../src/notifications/scheduleDueReminders';

const mockCancelAll = jest.fn(() => Promise.resolve());
const mockSchedule = jest.fn(() => Promise.resolve('scheduled-id'));
const mockGetPermissions = jest.fn(() =>
  Promise.resolve({ status: 'granted', granted: true }),
);
const mockRequestPermissions = jest.fn(() =>
  Promise.resolve({ status: 'granted', granted: true }),
);

jest.mock('expo-notifications', () => ({
  SchedulableTriggerInputTypes: { DATE: 'date' },
  cancelAllScheduledNotificationsAsync: (...args: unknown[]) =>
    mockCancelAll(...args),
  scheduleNotificationAsync: (...args: unknown[]) => mockSchedule(...args),
  getPermissionsAsync: (...args: unknown[]) => mockGetPermissions(...args),
  requestPermissionsAsync: (...args: unknown[]) =>
    mockRequestPermissions(...args),
}));

describe('syncDueReminders', () => {
  const items: AgendaItem[] = [
    {
      id: 'soon',
      title: 'Sketch garden notes',
      startsAt: '2026-08-16T11:00:00.000Z',
      done: false,
    },
    {
      id: 'done',
      title: 'Morning walk',
      startsAt: '2026-08-16T12:00:00.000Z',
      done: true,
    },
    {
      id: 'past',
      title: 'Already bloomed',
      startsAt: '2026-08-16T08:00:00.000Z',
      done: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetPermissions.mockResolvedValue({ status: 'granted', granted: true });
    mockRequestPermissions.mockResolvedValue({
      status: 'granted',
      granted: true,
    });
  });

  it('requests permission when not yet granted, then schedules future incomplete tasks', async () => {
    mockGetPermissions.mockResolvedValueOnce({
      status: 'undetermined',
      granted: false,
    });

    await syncDueReminders(items, new Date('2026-08-16T09:00:00.000Z'));

    expect(mockRequestPermissions).toHaveBeenCalled();
    expect(mockCancelAll).toHaveBeenCalled();
    expect(mockSchedule).toHaveBeenCalledTimes(1);
    expect(mockSchedule).toHaveBeenCalledWith({
      identifier: 'due-reminder:soon',
      content: {
        title: 'Coming up in 1 minute',
        body: 'Sketch garden notes',
        data: { agendaItemId: 'soon' },
        sound: true,
      },
      trigger: {
        type: 'date',
        date: new Date('2026-08-16T10:59:00.000Z'),
      },
    });
  });

  it('skips scheduling when notification permission is denied', async () => {
    mockGetPermissions.mockResolvedValueOnce({
      status: 'denied',
      granted: false,
    });
    mockRequestPermissions.mockResolvedValueOnce({
      status: 'denied',
      granted: false,
    });

    await syncDueReminders(items, new Date('2026-08-16T09:00:00.000Z'));

    expect(mockSchedule).not.toHaveBeenCalled();
  });

  it('still cancels prior reminders before rescheduling so edits stay in sync', async () => {
    await syncDueReminders(
      [
        {
          id: 'soon',
          title: 'Sketch garden notes',
          startsAt: '2026-08-16T14:00:00.000Z',
          done: false,
        },
      ],
      new Date('2026-08-16T09:00:00.000Z'),
    );

    expect(mockCancelAll).toHaveBeenCalled();
    expect(mockSchedule).toHaveBeenCalledWith(
      expect.objectContaining({
        identifier: 'due-reminder:soon',
        trigger: {
          type: 'date',
          date: new Date('2026-08-16T13:59:00.000Z'),
        },
      }),
    );
  });
});
