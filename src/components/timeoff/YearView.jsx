import { useState } from 'react';
import { useTimeOff } from '../../contexts/TimeOffContext';
import { useRecoveryGaps } from '../../hooks/useRecoveryGaps';
import { MonthCalendar } from './MonthCalendar';
import { TimeOffTable } from './TimeOffTable';
import { TimeOffForm } from './TimeOffForm';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import styles from './YearView.module.css';

export function YearView() {
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const { entries } = useTimeOff();
  const gapAnalysis = useRecoveryGaps();

  const currentYear = new Date().getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => i);

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingEntry(null);
  };

  return (
    <div className={styles.yearView}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Year View</h1>
          <p className={styles.subtitle}>{currentYear} Time-Off Planning</p>
        </div>
        <Button onClick={() => setShowForm(true)} data-tutorial="add-timeoff">
          Add Time Off
        </Button>
      </header>

      {/* Gap Alerts */}
      {gapAnalysis.hasGaps && (
        <section className={styles.alerts}>
          {gapAnalysis.gaps.map((gap, idx) => (
            <Card key={idx} variant="flat" padding="md" className={styles.alertCard}>
              <CardContent>
                <div className={styles.alertContent}>
                  <span className={styles.alertIcon}>📅</span>
                  <div>
                    <h4 className={styles.alertTitle}>Recovery Gap</h4>
                    <p className={styles.alertMessage}>{gap.message}</p>
                    <p className={styles.alertHint}>
                      Consider adding a short break to maintain sustainable energy.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      {/* Recommendations */}
      {gapAnalysis.recommendations.length > 0 && (
        <section className={styles.recommendations}>
          {gapAnalysis.recommendations.map((rec, idx) => (
            <div
              key={idx}
              className={`${styles.recommendation} ${styles[rec.priority]}`}
            >
              <span className={styles.recIcon}>
                {rec.type === 'positive' ? '✨' : '💡'}
              </span>
              <span>{rec.message}</span>
            </div>
          ))}
        </section>
      )}

      {/* Stats */}
      <section className={styles.stats}>
        <Card padding="md">
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{gapAnalysis.totalTimeOff || 0}</span>
              <span className={styles.statLabel}>Days Planned</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{gapAnalysis.totalEntries || 0}</span>
              <span className={styles.statLabel}>Occasions</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>
                {gapAnalysis.longestStretch || 0}
              </span>
              <span className={styles.statLabel}>Max Weeks Between</span>
            </div>
          </div>
        </Card>
      </section>

      {/* Calendar Grid */}
      <section className={styles.calendar} data-tutorial="year-view">
        <h2 className={styles.sectionTitle}>Calendar Overview</h2>
        <div className={styles.calendarGrid}>
          {months.map((month) => (
            <MonthCalendar
              key={month}
              year={currentYear}
              month={month}
              entries={entries}
            />
          ))}
        </div>
      </section>

      {/* Time Off Table */}
      <section className={styles.table} data-tutorial="timeoff-list">
        <h2 className={styles.sectionTitle}>Planned Time Off</h2>
        <TimeOffTable entries={entries} onEdit={handleEdit} />
      </section>

      {/* Add/Edit Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={handleClose}
        title={editingEntry ? 'Edit Time Off' : 'Add Time Off'}
      >
        <TimeOffForm entry={editingEntry} onClose={handleClose} />
      </Modal>
    </div>
  );
}
