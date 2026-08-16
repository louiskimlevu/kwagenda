import type { AgendaItem } from './types';

/** Seed plans for a quiet floral day — used until the gardener adds their own. */
export const sampleAgendaItems: AgendaItem[] = [
  {
    id: 'seed-1',
    title: 'Morning walk among the blooms',
    startsAt: '2026-08-16T08:30:00.000Z',
    done: false,
  },
  {
    id: 'seed-2',
    title: 'Sketch garden notes',
    startsAt: '2026-08-16T11:00:00.000Z',
    done: false,
  },
  {
    id: 'seed-3',
    title: 'Tea under the peonies',
    startsAt: '2026-08-16T15:30:00.000Z',
    done: false,
  },
];
