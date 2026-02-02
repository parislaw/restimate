import { useState, useRef } from 'react';
import { useBreakSchedule } from '../../hooks/useBreakSchedule';
import { useInsights } from '../../hooks/useInsights';
import { useUserData } from '../../contexts/UserDataContext';
import { BreakTimeline } from './BreakTimeline';
import { BreakCard } from './BreakCard';
import { WorkdayConfig } from './WorkdayConfig';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import styles from './DailyPlanner.module.css';

export function DailyPlanner() {
  const [showConfig, setShowConfig] = useState(false);
  const [completedBreaks, setCompletedBreaks] = useState(new Set());
  const [rescheduleBreaks, setRescheduleBreaks] = useState({});
  const [draggingBreakId, setDraggingBreakId] = useState(null);
  const breakRefsMap = useRef(new Map());
  const trackRef = useRef(null);
  const { profile } = useUserData();
  const schedule = useBreakSchedule();
  const insights = useInsights();

  // Parse time string "HH:MM" to minutes since start of day
  const timeToMinutes = (timeStr) => {
    const [hours, mins] = timeStr.split(':').map(Number);
    return hours * 60 + mins;
  };

  // Convert minutes since start of day to "HH:MM" format
  const minutesToTime = (mins) => {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Snap time to 15-minute intervals
  const snapToInterval = (minutes, interval = 15) => {
    return Math.round(minutes / interval) * interval;
  };

  // Handle drag start on timeline block
  const handleDragStart = (breakId, e) => {
    console.log('Drag started for break:', breakId);
    setDraggingBreakId(breakId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('breakId', breakId);
  };

  // Handle drag over timeline
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle drop on timeline
  const handleDrop = (e) => {
    console.log('Drop event fired');
    e.preventDefault();
    const breakId = e.dataTransfer.getData('breakId');
    console.log('Dropped break ID:', breakId);

    if (!trackRef.current) {
      console.log('No track ref');
      return;
    }

    const rect = trackRef.current.getBoundingClientRect();
    console.log('Track rect:', rect);
    const clickX = e.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    console.log('Drop position:', clickX, 'percentage:', percentage);

    const breakObj = schedule.breaks.find(b => b.id === breakId);
    if (!breakObj) return;

    // Calculate new time based on drag position
    const workdayStart = timeToMinutes(schedule.workdayStart);
    const workdayEnd = timeToMinutes(schedule.workdayEnd);
    const workdayDuration = workdayEnd - workdayStart;

    const newStartMinutes = Math.floor(workdayStart + (percentage / 100) * workdayDuration);
    const snappedStart = snapToInterval(newStartMinutes);

    // Ensure it stays within work hours
    const constrainedStart = Math.max(
      workdayStart,
      Math.min(snappedStart, workdayEnd - breakObj.duration)
    );

    const newStartTime = minutesToTime(constrainedStart);
    const newEndTime = minutesToTime(constrainedStart + breakObj.duration);

    // Check for overlaps with other breaks
    const hasOverlap = schedule.breaks.some(b => {
      if (b.id === breakId) return false;
      const otherStart = timeToMinutes(b.startTime);
      const otherEnd = timeToMinutes(b.endTime);
      const newStart = timeToMinutes(newStartTime);
      const newEnd = timeToMinutes(newEndTime);

      return (newStart < otherEnd && newEnd > otherStart);
    });

    if (!hasOverlap) {
      console.log('No overlap, updating break to:', newStartTime, '-', newEndTime);
      setRescheduleBreaks(prev => ({
        ...prev,
        [breakId]: { startTime: newStartTime, endTime: newEndTime }
      }));
    } else {
      console.log('Overlap detected, not updating');
    }

    setDraggingBreakId(null);
  };

  const toggleBreakCompletion = (breakId) => {
    setCompletedBreaks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(breakId)) {
        newSet.delete(breakId);
      } else {
        newSet.add(breakId);
      }
      return newSet;
    });
  };

  const handleBreakClick = (breakId) => {
    const element = breakRefsMap.current.get(breakId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const registerBreakRef = (breakId, element) => {
    if (element) {
      breakRefsMap.current.set(breakId, element);
    } else {
      breakRefsMap.current.delete(breakId);
    }
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const topInsights = insights.slice(0, 2);

  return (
    <div className={styles.planner}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Daily Planner</h1>
          <p className={styles.date}>{today}</p>
        </div>
        <Button variant="secondary" onClick={() => setShowConfig(!showConfig)}>
          {showConfig ? 'Hide Settings' : 'Adjust Schedule'}
        </Button>
      </header>

      {showConfig && (
        <WorkdayConfig onClose={() => setShowConfig(false)} />
      )}

      {/* Insights Section */}
      {topInsights.length > 0 && (
        <section className={styles.insights}>
          {topInsights.map((insight) => (
            <Card key={insight.id} variant="flat" padding="md">
              <CardContent>
                <div className={styles.insightContent}>
                  <span className={styles.insightIcon}>{insight.icon}</span>
                  <div>
                    <h4 className={styles.insightTitle}>{insight.title}</h4>
                    <p className={styles.insightMessage}>{insight.message}</p>
                    {insight.action && (
                      <span className={styles.insightAction}>{insight.action}</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      {/* Schedule Overview */}
      <section className={styles.overview}>
        <Card padding="lg">
          <div className={styles.overviewGrid}>
            <div className={styles.overviewItem}>
              <span className={styles.overviewValue}>{schedule.workdayStartDisplay}</span>
              <span className={styles.overviewLabel}>Start</span>
            </div>
            <div className={styles.overviewItem}>
              <span className={styles.overviewValue}>{schedule.workdayEndDisplay}</span>
              <span className={styles.overviewLabel}>End</span>
            </div>
            <div className={styles.overviewItem}>
              <span className={styles.overviewValue}>{schedule.totalBreaks}</span>
              <span className={styles.overviewLabel}>Breaks</span>
            </div>
            <div className={styles.overviewItem}>
              <span className={styles.overviewValue}>{schedule.totalBreakTime}m</span>
              <span className={styles.overviewLabel}>Rest Time</span>
            </div>
          </div>
        </Card>
      </section>

      {/* Visual Timeline */}
      <section className={styles.timeline}>
        <h2 className={styles.sectionTitle}>Your Day</h2>
        <p className={styles.timelineHint}>Drag breaks to reschedule them</p>
        <BreakTimeline
          ref={trackRef}
          breaks={schedule.breaks.map(b => ({
            ...b,
            startTime: rescheduleBreaks[b.id]?.startTime || b.startTime,
            endTime: rescheduleBreaks[b.id]?.endTime || b.endTime,
          }))}
          workdayStart={schedule.workdayStart}
          workdayEnd={schedule.workdayEnd}
          onBreakClick={handleBreakClick}
          onDragStart={handleDragStart}
          draggingBreakId={draggingBreakId}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      </section>

      {/* Break Cards */}
      <section className={styles.breaks}>
        <h2 className={styles.sectionTitle}>Rest Points</h2>
        <p className={styles.sectionSubtitle}>
          {schedule.breakFrequency}-minute focus blocks, {schedule.breakDuration}-minute breaks
        </p>
        <div className={styles.breaksList}>
          {schedule.breaks.map((brk) => (
            <div
              key={brk.id}
              ref={(el) => registerBreakRef(brk.id, el)}
            >
              <BreakCard
                breakData={brk}
                recoveryStyle={profile?.recovery_style}
                completed={completedBreaks.has(brk.id)}
                onToggleCompletion={() => toggleBreakCompletion(brk.id)}
              />
            </div>
          ))}
          {schedule.breaks.length === 0 && (
            <Card padding="lg" className={styles.emptyCard}>
              <p className={styles.emptyText}>
                No breaks scheduled. Adjust your work hours or break frequency.
              </p>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
