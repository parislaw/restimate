import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';
import styles from './WorkRhythmSetup.module.css';

const frequencyOptions = [
  { value: 60, label: 'Every hour' },
  { value: 90, label: 'Every 90 minutes (recommended)' },
  { value: 120, label: 'Every 2 hours' },
  { value: 180, label: 'Every 3 hours' },
];

const durationOptions = [
  { value: 5, label: '5 minutes' },
  { value: 10, label: '10 minutes' },
  { value: 15, label: '15 minutes (recommended)' },
  { value: 20, label: '20 minutes' },
];

export function WorkRhythmSetup({ onComplete, onBack, recoveryStyle, loading }) {
  const [workdayStart, setWorkdayStart] = useState('09:00');
  const [workdayEnd, setWorkdayEnd] = useState('17:00');
  const [breakFrequency, setBreakFrequency] = useState(90);
  const [breakDuration, setBreakDuration] = useState(15);

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete({
      workdayStart,
      workdayEnd,
      breakFrequency,
      breakDuration,
    });
  };

  const calculateBreaks = () => {
    const [startH, startM] = workdayStart.split(':').map(Number);
    const [endH, endM] = workdayEnd.split(':').map(Number);
    const workMinutes = (endH * 60 + endM) - (startH * 60 + startM);
    return Math.max(0, Math.floor(workMinutes / breakFrequency) - 1);
  };

  const totalBreakTime = calculateBreaks() * breakDuration;

  return (
    <div className={styles.setup}>
      <div className={styles.header}>
        <h2 className={styles.title}>Set Your Work Rhythm</h2>
        <p className={styles.subtitle}>
          As a <strong>{recoveryStyle}</strong>, we'll optimize your break schedule for your style.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.timeRow}>
          <Input
            type="time"
            label="Workday Start"
            value={workdayStart}
            onChange={(e) => setWorkdayStart(e.target.value)}
            required
          />
          <Input
            type="time"
            label="Workday End"
            value={workdayEnd}
            onChange={(e) => setWorkdayEnd(e.target.value)}
            required
          />
        </div>

        <Select
          label="Break Frequency"
          value={breakFrequency}
          onChange={(e) => setBreakFrequency(Number(e.target.value))}
        >
          {frequencyOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>

        <Select
          label="Break Duration"
          value={breakDuration}
          onChange={(e) => setBreakDuration(Number(e.target.value))}
        >
          {durationOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>

        <div className={styles.preview}>
          <div className={styles.previewItem}>
            <span className={styles.previewLabel}>Breaks per day</span>
            <span className={styles.previewValue}>{calculateBreaks()}</span>
          </div>
          <div className={styles.previewItem}>
            <span className={styles.previewLabel}>Total rest time</span>
            <span className={styles.previewValue}>{totalBreakTime} mins</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="ghost" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" loading={loading}>
            Complete Setup
          </Button>
        </div>
      </form>
    </div>
  );
}
