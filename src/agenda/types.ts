export type AgendaItem = {
  id: string;
  title: string;
  startsAt: string;
  done: boolean;
};

/** How agenda wall-clock times are displayed and edited. */
export type AgendaTimeZoneMode = 'utc' | 'local';
