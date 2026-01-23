import { useMemo } from 'react';
import { useTimeOff } from '../contexts/TimeOffContext';

const WEEKS_THRESHOLD = 8;
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

/**
 * Calculate weeks between two dates
 */
function weeksBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diff = Math.abs(d2 - d1);
  return Math.floor(diff / MS_PER_WEEK);
}

/**
 * Custom hook to detect recovery gaps in time-off entries
 */
export function useRecoveryGaps() {
  const { entries } = useTimeOff();

  const analysis = useMemo(() => {
    if (!entries || entries.length === 0) {
      // Check gap from today to end of year
      const today = new Date();
      const endOfYear = new Date(today.getFullYear(), 11, 31);
      const weeksToEndOfYear = weeksBetween(today, endOfYear);

      return {
        gaps: weeksToEndOfYear >= WEEKS_THRESHOLD ? [{
          weeks: weeksToEndOfYear,
          startDate: today.toISOString().split('T')[0],
          endDate: endOfYear.toISOString().split('T')[0],
          message: `You have no time off planned for the rest of the year (${weeksToEndOfYear} weeks)`,
          severity: 'warning',
        }] : [],
        totalTimeOff: 0,
        averageGap: weeksToEndOfYear,
        longestStretch: weeksToEndOfYear,
        hasGaps: weeksToEndOfYear >= WEEKS_THRESHOLD,
        recommendations: getRecommendations(weeksToEndOfYear, 0),
      };
    }

    const sortedEntries = [...entries].sort(
      (a, b) => new Date(a.start_date) - new Date(b.start_date)
    );

    const gaps = [];
    const today = new Date();

    // Check gap from today to first entry
    const firstEntry = sortedEntries[0];
    const weeksToFirst = weeksBetween(today, firstEntry.start_date);
    if (weeksToFirst >= WEEKS_THRESHOLD && new Date(firstEntry.start_date) > today) {
      gaps.push({
        weeks: weeksToFirst,
        startDate: today.toISOString().split('T')[0],
        endDate: firstEntry.start_date,
        message: `${weeksToFirst} weeks until your next time off`,
        severity: weeksToFirst >= 12 ? 'high' : 'medium',
      });
    }

    // Check gaps between entries
    for (let i = 0; i < sortedEntries.length - 1; i++) {
      const currentEnd = sortedEntries[i].end_date;
      const nextStart = sortedEntries[i + 1].start_date;
      const gapWeeks = weeksBetween(currentEnd, nextStart);

      if (gapWeeks >= WEEKS_THRESHOLD) {
        gaps.push({
          weeks: gapWeeks,
          startDate: currentEnd,
          endDate: nextStart,
          message: `${gapWeeks}-week stretch between "${sortedEntries[i].occasion}" and "${sortedEntries[i + 1].occasion}"`,
          severity: gapWeeks >= 12 ? 'high' : 'medium',
        });
      }
    }

    // Check gap from last entry to end of year
    const lastEntry = sortedEntries[sortedEntries.length - 1];
    const endOfYear = new Date(today.getFullYear(), 11, 31);
    const weeksToEndOfYear = weeksBetween(lastEntry.end_date, endOfYear);
    if (weeksToEndOfYear >= WEEKS_THRESHOLD && new Date(lastEntry.end_date) < endOfYear) {
      gaps.push({
        weeks: weeksToEndOfYear,
        startDate: lastEntry.end_date,
        endDate: endOfYear.toISOString().split('T')[0],
        message: `${weeksToEndOfYear} weeks from "${lastEntry.occasion}" to end of year`,
        severity: weeksToEndOfYear >= 12 ? 'high' : 'medium',
      });
    }

    // Calculate total time off days
    const totalTimeOff = sortedEntries.reduce((total, entry) => {
      const start = new Date(entry.start_date);
      const end = new Date(entry.end_date);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      return total + days;
    }, 0);

    // Calculate longest stretch without time off
    const allGapWeeks = gaps.map(g => g.weeks);
    const longestStretch = allGapWeeks.length > 0 ? Math.max(...allGapWeeks) : 0;

    // Calculate average gap
    const averageGap = allGapWeeks.length > 0
      ? Math.round(allGapWeeks.reduce((a, b) => a + b, 0) / allGapWeeks.length)
      : 0;

    return {
      gaps,
      totalTimeOff,
      totalEntries: sortedEntries.length,
      averageGap,
      longestStretch,
      hasGaps: gaps.length > 0,
      recommendations: getRecommendations(longestStretch, totalTimeOff),
    };
  }, [entries]);

  return analysis;
}

/**
 * Generate gentle recommendations based on gaps
 */
function getRecommendations(longestStretch, totalTimeOff) {
  const recommendations = [];

  if (longestStretch >= 12) {
    recommendations.push({
      type: 'gap',
      message: 'Consider adding a short break in your longest stretch. Even a long weekend can help.',
      priority: 'high',
    });
  } else if (longestStretch >= 8) {
    recommendations.push({
      type: 'gap',
      message: 'You have a longer period without rest. A mental health day could help maintain balance.',
      priority: 'medium',
    });
  }

  if (totalTimeOff < 10) {
    recommendations.push({
      type: 'total',
      message: 'Your planned time off is below average. Rest isn\'t a reward—it\'s maintenance.',
      priority: 'medium',
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      type: 'positive',
      message: 'Your rest schedule looks well-distributed. Keep up the intentional planning!',
      priority: 'low',
    });
  }

  return recommendations;
}

/**
 * Get months with time off for calendar highlighting
 */
export function useTimeOffByMonth() {
  const { entries } = useTimeOff();

  return useMemo(() => {
    const monthMap = {};

    entries.forEach(entry => {
      const start = new Date(entry.start_date);
      const end = new Date(entry.end_date);

      // Mark all months between start and end
      let current = new Date(start);
      while (current <= end) {
        const monthKey = `${current.getFullYear()}-${current.getMonth()}`;
        if (!monthMap[monthKey]) {
          monthMap[monthKey] = [];
        }
        monthMap[monthKey].push(entry);
        current.setMonth(current.getMonth() + 1);
      }
    });

    return monthMap;
  }, [entries]);
}
