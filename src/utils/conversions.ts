import { Log, LogTypes, UserMetrics } from '@pv/types';

export const sortConversions = (
  conversionDates?: Map<string, number>
): Array<{ value: number }> => {
  if (!conversionDates) {
    return [];
  }

  return [...conversionDates.entries()].sort().map(([_, v]) => ({ value: v }));
};

export const aggregateData = (logsData: Log[]) => {
  const userMetrics = new Map<number, UserMetrics>();
  let minDay: string | null = null;
  let maxDay: string | null = null;

  for (const log of logsData) {
    if (!userMetrics.has(log.user_id)) {
      userMetrics.set(log.user_id, {
        impressions: log.type === LogTypes.IMPRESSION ? 1 : 0,
        conversions: log.type === LogTypes.CONVERSION ? 1 : 0,
        revenue: log.revenue,
        conversionDates: new Map(),
      });
      continue;
    }

    const currentUser = userMetrics.get(log.user_id) as UserMetrics;

    // update impression / conversion count
    if (log.type === LogTypes.IMPRESSION) {
      currentUser.impressions += 1;
    } else if (log.type === LogTypes.CONVERSION) {
      currentUser.conversions += 1;

      // track conversions by date
      const dayKey = log.time.replace(/\s.*/, '');
      currentUser.conversionDates.set(
        dayKey,
        (currentUser.conversionDates.get(dayKey) || 0) + 1
      );

      // update min/max days
      if (!minDay || dayKey < minDay) minDay = dayKey;
      else if (!maxDay || dayKey > maxDay) maxDay = dayKey;
    }

    // update revenue
    currentUser.revenue += log.revenue;
  }

  return {
    minDay: new Date(minDay as string).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'numeric',
    }),
    maxDay: new Date(maxDay as string).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'numeric',
    }),
    userMetrics,
  };
};
