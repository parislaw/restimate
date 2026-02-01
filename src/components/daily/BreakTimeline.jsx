import styles from './BreakTimeline.module.css';

function parseTime(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatDisplayTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${displayHours}${mins > 0 ? ':' + mins.toString().padStart(2, '0') : ''} ${period}`;
}

export function BreakTimeline({ breaks, workdayStart, workdayEnd, onBreakClick }) {
  const startMins = parseTime(workdayStart);
  const endMins = parseTime(workdayEnd);
  const totalMins = endMins - startMins;

  const getPosition = (timeStr) => {
    const timeMins = parseTime(timeStr);
    return ((timeMins - startMins) / totalMins) * 100;
  };

  // Generate hour markers
  const hourMarkers = [];
  const startHour = Math.ceil(startMins / 60);
  const endHour = Math.floor(endMins / 60);

  for (let hour = startHour; hour <= endHour; hour++) {
    const mins = hour * 60;
    if (mins >= startMins && mins <= endMins) {
      hourMarkers.push({
        position: ((mins - startMins) / totalMins) * 100,
        label: formatDisplayTime(mins),
      });
    }
  }

  return (
    <div className={styles.timeline}>
      <div className={styles.track}>
        {/* Hour markers */}
        {hourMarkers.map((marker, idx) => (
          <div
            key={idx}
            className={styles.hourMarker}
            style={{ left: `${marker.position}%` }}
          >
            <div className={styles.hourLine} />
            <span className={styles.hourLabel}>{marker.label}</span>
          </div>
        ))}

        {/* Break blocks */}
        {breaks.map((brk) => {
          const startPos = getPosition(brk.startTime);
          const endPos = getPosition(brk.endTime);
          const width = endPos - startPos;

          return (
            <div
              key={brk.id}
              className={styles.breakBlock}
              style={{
                left: `${startPos}%`,
                width: `${width}%`,
              }}
              title={`${brk.startTimeDisplay} - ${brk.endTimeDisplay}`}
              onClick={() => onBreakClick?.(brk.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onBreakClick?.(brk.id);
                }
              }}
            >
              <span className={styles.breakTime}>{brk.startTimeDisplay}</span>
            </div>
          );
        })}
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ backgroundColor: 'var(--color-primary)' }} />
          <span>Rest Point</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ backgroundColor: 'var(--color-border-light)' }} />
          <span>Focus Time</span>
        </div>
      </div>
    </div>
  );
}
