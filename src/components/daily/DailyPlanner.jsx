import { useState } from 'react';
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
  const { profile } = useUserData();
  const schedule = useBreakSchedule();
  const insights = useInsights();

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
        <div data-tutorial="workday-config">
          <WorkdayConfig onClose={() => setShowConfig(false)} />
        </div>
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
      <section className={styles.timeline} data-tutorial="break-timeline">
        <h2 className={styles.sectionTitle}>Your Day</h2>
        <BreakTimeline
          breaks={schedule.breaks}
          workdayStart={schedule.workdayStart}
          workdayEnd={schedule.workdayEnd}
        />
      </section>

      {/* Break Cards */}
      <section className={styles.breaks} data-tutorial="break-suggestions">
        <h2 className={styles.sectionTitle}>Rest Points</h2>
        <p className={styles.sectionSubtitle}>
          {schedule.breakFrequency}-minute focus blocks, {schedule.breakDuration}-minute breaks
        </p>
        <div className={styles.breaksList}>
          {schedule.breaks.map((brk) => (
            <BreakCard
              key={brk.id}
              breakData={brk}
              recoveryStyle={profile?.recovery_style}
            />
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
