import { useMemo } from 'react';
import styles from './MonthCalendar.module.css';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function MonthCalendar({ year, month, entries }) {
  const { days, daysWithTimeOff } = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    // Build array of days
    const days = [];

    // Empty cells before first day
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({ day: null, isTimeOff: false });
    }

    // Days of the month
    const timeOffDays = new Set();

    entries.forEach(entry => {
      const start = new Date(entry.start_date);
      const end = new Date(entry.end_date);

      // Check each day in the entry range
      let current = new Date(start);
      while (current <= end) {
        if (current.getFullYear() === year && current.getMonth() === month) {
          timeOffDays.add(current.getDate());
        }
        current.setDate(current.getDate() + 1);
      }
    });

    for (let d = 1; d <= daysInMonth; d++) {
      days.push({
        day: d,
        isTimeOff: timeOffDays.has(d),
        isToday: isToday(year, month, d),
      });
    }

    return { days, daysWithTimeOff: timeOffDays };
  }, [year, month, entries]);

  const hasTimeOff = daysWithTimeOff.size > 0;

  return (
    <div className={`${styles.month} ${hasTimeOff ? styles.hasTimeOff : ''}`}>
      <h3 className={styles.monthTitle}>{MONTHS[month]}</h3>
      <div className={styles.daysHeader}>
        {DAYS.map((day, i) => (
          <span key={i} className={styles.dayHeader}>{day}</span>
        ))}
      </div>
      <div className={styles.daysGrid}>
        {days.map((d, i) => (
          <span
            key={i}
            className={`
              ${styles.day}
              ${d.isTimeOff ? styles.timeOff : ''}
              ${d.isToday ? styles.today : ''}
              ${!d.day ? styles.empty : ''}
            `}
          >
            {d.day}
          </span>
        ))}
      </div>
    </div>
  );
}

function isToday(year, month, day) {
  const today = new Date();
  return (
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === day
  );
}
