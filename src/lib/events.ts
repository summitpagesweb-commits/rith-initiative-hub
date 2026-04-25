export interface EventDateFields {
  start_date: string;
  end_date: string | null;
}

const getEventEndBoundary = (event: EventDateFields): Date => {
  const boundary = new Date(event.end_date ?? event.start_date);
  boundary.setHours(23, 59, 59, 999);
  return boundary;
};

export const isEventUpcoming = (
  event: EventDateFields,
  now: Date = new Date()
): boolean => getEventEndBoundary(event).getTime() >= now.getTime();

export const splitEventsByTimeline = <T extends EventDateFields>(
  events: T[],
  now: Date = new Date()
): { upcoming: T[]; past: T[] } => {
  const upcoming: T[] = [];
  const past: T[] = [];

  events.forEach((event) => {
    if (isEventUpcoming(event, now)) {
      upcoming.push(event);
      return;
    }
    past.push(event);
  });

  return { upcoming, past };
};
