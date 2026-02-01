import { useState } from 'react';
import { useUserData } from '../../contexts/UserDataContext';
import { Card } from '../ui/Card';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import styles from './WorkdayConfig.module.css';

const frequencyOptions = [
  { value: 60, label: 'Every hour' },
  { value: 90, label: 'Every 90 minutes' },
  { value: 120, label: 'Every 2 hours' },
  { value: 180, label: 'Every 3 hours' },
];

const durationOptions = [
  { value: 5, label: '5 minutes' },
  { value: 10, label: '10 minutes' },
  { value: 15, label: '15 minutes' },
  { value: 20, label: '20 minutes' },
];

export function WorkdayConfig({ onClose }) {
  const { profile, updateProfile } = useUserData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({
    workdayStart: profile?.workday_start || '09:00',
    workdayEnd: profile?.workday_end || '17:00',
    breakFrequency: profile?.break_frequency_mins || 90,
    breakDuration: profile?.break_duration_mins || 15,
  });

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateSettings = () => {
    if (settings.workdayEnd <= settings.workdayStart) {
      setError('End time must be after start time');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateSettings()) return;

    setLoading(true);
    const { error: saveError } = await updateProfile({
      workday_start: settings.workdayStart,
      workday_end: settings.workdayEnd,
      break_frequency_mins: settings.breakFrequency,
      break_duration_mins: settings.breakDuration,
    });
    setLoading(false);

    if (saveError) {
      setError(saveError.message || 'Failed to save settings');
    } else {
      onClose();
    }
  };

  return (
    <Card padding="lg" className={styles.config}>
      <h3 className={styles.title}>Adjust Your Schedule</h3>

      <div className={styles.form}>
        <div className={styles.row}>
          <Input
            type="time"
            label="Workday Start"
            value={settings.workdayStart}
            onChange={(e) => handleChange('workdayStart', e.target.value)}
          />
          <Input
            type="time"
            label="Workday End"
            value={settings.workdayEnd}
            onChange={(e) => handleChange('workdayEnd', e.target.value)}
            error={error?.includes('End time') ? error : ''}
          />
        </div>

        <div className={styles.row}>
          <Select
            label="Break Frequency"
            value={settings.breakFrequency}
            onChange={(e) => handleChange('breakFrequency', Number(e.target.value))}
          >
            {frequencyOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>

          <Select
            label="Break Duration"
            value={settings.breakDuration}
            onChange={(e) => handleChange('breakDuration', Number(e.target.value))}
          >
            {durationOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>

        {error && !error.includes('End time') && (
          <div className={styles.errorMessage}>{error}</div>
        )}

        <div className={styles.actions}>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} loading={loading} disabled={!!error || loading}>
            Save Changes
          </Button>
        </div>
      </div>
    </Card>
  );
}
