import { useMemo } from 'react';
import { useUserData } from '../contexts/UserDataContext';
import { useTimeOff } from '../contexts/TimeOffContext';
import { useBreakSchedule } from './useBreakSchedule';
import { useRecoveryGaps } from './useRecoveryGaps';

/**
 * Custom hook to generate personalized insights
 */
export function useInsights() {
  const { profile } = useUserData();
  const { entries } = useTimeOff();
  const schedule = useBreakSchedule();
  const gapAnalysis = useRecoveryGaps();

  const insights = useMemo(() => {
    const result = [];

    if (!profile) return result;

    // Insight: Break frequency
    if (schedule.breakFrequency > 120) {
      result.push({
        id: 'long-focus-blocks',
        type: 'awareness',
        icon: '⏰',
        title: 'Long Focus Blocks',
        message: `You're working ${schedule.breakFrequency / 60} hours between breaks. Research suggests 90-minute focus blocks optimize cognitive performance.`,
        action: 'Consider shorter intervals',
        priority: 2,
      });
    }

    // Insight: Work hours
    const workMinutes = calculateWorkMinutes(profile.workday_start, profile.workday_end);
    if (workMinutes > 540) { // More than 9 hours
      result.push({
        id: 'long-workday',
        type: 'awareness',
        icon: '📊',
        title: 'Extended Workday',
        message: `Your ${Math.round(workMinutes / 60)}-hour workday is above average. Longer days may benefit from more frequent breaks.`,
        action: 'Review your schedule',
        priority: 1,
      });
    }

    // Insight: Recovery style suggestions
    const styleInsights = getRecoveryStyleInsights(profile.recovery_style);
    if (styleInsights) {
      result.push({
        id: 'recovery-style-tip',
        type: 'tip',
        icon: styleInsights.icon,
        title: `${profile.recovery_style} Tip`,
        message: styleInsights.message,
        action: styleInsights.action,
        priority: 3,
      });
    }

    // Insight: Time off gaps
    if (gapAnalysis.hasGaps && gapAnalysis.gaps.length > 0) {
      const worstGap = gapAnalysis.gaps.reduce((max, g) => g.weeks > max.weeks ? g : max);
      result.push({
        id: 'recovery-gap',
        type: 'awareness',
        icon: '🗓️',
        title: 'Recovery Gap Detected',
        message: worstGap.message,
        action: 'Plan a break',
        priority: 1,
      });
    }

    // Insight: Positive reinforcement
    if (entries.length >= 3 && !gapAnalysis.hasGaps) {
      result.push({
        id: 'well-planned',
        type: 'positive',
        icon: '✨',
        title: 'Well-Paced Rest',
        message: 'Your time off is nicely distributed throughout the year. This supports sustained energy and prevents burnout.',
        action: null,
        priority: 4,
      });
    }

    // Insight: Break count
    if (schedule.totalBreaks >= 4) {
      result.push({
        id: 'good-break-count',
        type: 'positive',
        icon: '🎯',
        title: 'Regular Breaks',
        message: `${schedule.totalBreaks} breaks scheduled today. Regular micro-recovery adds up to macro benefits.`,
        action: null,
        priority: 4,
      });
    }

    // Daily tip based on day of week
    const dayTip = getDayOfWeekTip();
    if (dayTip) {
      result.push({
        id: 'day-tip',
        type: 'tip',
        icon: dayTip.icon,
        title: dayTip.title,
        message: dayTip.message,
        action: dayTip.action,
        priority: 3,
      });
    }

    // Sort by priority
    return result.sort((a, b) => a.priority - b.priority);
  }, [profile, entries, schedule, gapAnalysis]);

  return insights;
}

function calculateWorkMinutes(startTime, endTime) {
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  return (endH * 60 + endM) - (startH * 60 + startM);
}

function getRecoveryStyleInsights(style) {
  const insights = {
    'Social Recharger': {
      icon: '👥',
      message: 'Social connection is your fuel. Even brief interactions during breaks can boost your energy significantly.',
      action: 'Try a coffee chat break',
    },
    'Solo Decompressor': {
      icon: '🧘',
      message: 'Quiet time helps you process and recharge. Protect your breaks from interruptions when possible.',
      action: 'Find a quiet spot',
    },
    'Physical Resetter': {
      icon: '🏃',
      message: 'Movement clears your mind. Even a short walk or stretch can reset your focus and energy.',
      action: 'Try desk stretches',
    },
    'Mental Unplugger': {
      icon: '🌿',
      message: 'Screen-free moments help your brain recover. Step away from digital stimulation during breaks.',
      action: 'Try a nature view break',
    },
  };

  return insights[style] || null;
}

function getDayOfWeekTip() {
  const day = new Date().getDay();

  const tips = {
    0: null, // Sunday
    1: {
      icon: '🌅',
      title: 'Monday Momentum',
      message: 'Mondays set the tone. Start with intentional breaks to build sustainable pace for the week.',
      action: 'Set break reminders',
    },
    2: null,
    3: {
      icon: '⚖️',
      title: 'Midweek Check',
      message: 'Wednesday is a good time to assess your energy. Are you on track or running on fumes?',
      action: 'Take a longer break today',
    },
    4: null,
    5: {
      icon: '🎉',
      title: 'Friday Finish',
      message: 'Studies show people skip breaks on Fridays, rushing to finish. Rest now for a better weekend.',
      action: 'Don\'t skip your breaks',
    },
    6: null, // Saturday
  };

  return tips[day] || null;
}
