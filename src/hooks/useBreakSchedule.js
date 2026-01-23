import { useMemo } from 'react';
import { useUserData } from '../contexts/UserDataContext';

/**
 * Parses a time string "HH:MM" into minutes since midnight
 */
function parseTime(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Converts minutes since midnight to a time string "HH:MM"
 */
function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Formats minutes since midnight to a display time "h:mm AM/PM"
 */
function formatDisplayTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
}

/**
 * Generates a break schedule based on workday settings
 */
function generateBreakSchedule(workdayStart, workdayEnd, frequencyMins, durationMins) {
  const breaks = [];
  const startMins = parseTime(workdayStart);
  const endMins = parseTime(workdayEnd);

  // First break after frequency minutes from start
  let currentTime = startMins + frequencyMins;

  let breakNumber = 1;
  while (currentTime + durationMins <= endMins) {
    breaks.push({
      id: breakNumber,
      startTime: formatTime(currentTime),
      startTimeDisplay: formatDisplayTime(currentTime),
      endTime: formatTime(currentTime + durationMins),
      endTimeDisplay: formatDisplayTime(currentTime + durationMins),
      duration: durationMins,
      type: 'REST POINT',
      completed: false,
    });

    currentTime += frequencyMins;
    breakNumber++;
  }

  return breaks;
}

/**
 * Custom hook to generate and manage break schedule
 */
export function useBreakSchedule(overrides = {}) {
  const { profile } = useUserData();

  const schedule = useMemo(() => {
    if (!profile) {
      return {
        breaks: [],
        workdayStart: '09:00',
        workdayEnd: '17:00',
        breakFrequency: 90,
        breakDuration: 15,
        totalBreaks: 0,
        totalBreakTime: 0,
      };
    }

    const workdayStart = overrides.workdayStart || profile.workday_start || '09:00';
    const workdayEnd = overrides.workdayEnd || profile.workday_end || '17:00';
    const breakFrequency = overrides.breakFrequency || profile.break_frequency_mins || 90;
    const breakDuration = overrides.breakDuration || profile.break_duration_mins || 15;

    const breaks = generateBreakSchedule(
      workdayStart,
      workdayEnd,
      breakFrequency,
      breakDuration
    );

    return {
      breaks,
      workdayStart,
      workdayEnd,
      workdayStartDisplay: formatDisplayTime(parseTime(workdayStart)),
      workdayEndDisplay: formatDisplayTime(parseTime(workdayEnd)),
      breakFrequency,
      breakDuration,
      totalBreaks: breaks.length,
      totalBreakTime: breaks.length * breakDuration,
    };
  }, [profile, overrides.workdayStart, overrides.workdayEnd, overrides.breakFrequency, overrides.breakDuration]);

  return schedule;
}

/**
 * Utility to get suggested break actions based on time of day
 */
export function getBreakSuggestion(timeStr) {
  const mins = parseTime(timeStr);
  const hour = Math.floor(mins / 60);

  if (hour < 10) {
    return { type: 'ENERGIZING', message: 'Start your day with an energizing break' };
  } else if (hour < 12) {
    return { type: 'FOCUS', message: 'Mid-morning reset to maintain focus' };
  } else if (hour >= 12 && hour < 14) {
    return { type: 'RECHARGE', message: 'Post-lunch recovery time' };
  } else if (hour < 16) {
    return { type: 'REFRESH', message: 'Afternoon refresh to avoid the slump' };
  } else {
    return { type: 'WIND-DOWN', message: 'Wind down as you approach end of day' };
  }
}
