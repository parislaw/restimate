import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUserData } from '../contexts/UserDataContext';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import styles from './Profile.module.css';

export default function Profile() {
  const { user } = useAuth();
  const { profile, RECOVERY_STYLES, updateProfile } = useUserData();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    recovery_style: profile?.recovery_style || '',
    workday_start: profile?.workday_start || '09:00',
    workday_end: profile?.workday_end || '17:00',
    break_frequency_mins: profile?.break_frequency_mins || 90,
    break_duration_mins: profile?.break_duration_mins || 15,
    reminder_enabled: profile?.reminder_enabled || false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.recovery_style) {
      setError('Recovery style is required');
      return false;
    }

    // Validate workday times (lexicographic comparison works for HH:MM format)
    if (formData.workday_end <= formData.workday_start) {
      setError('End time must be after start time');
      return false;
    }

    if (formData.break_frequency_mins <= 0) {
      setError('Break frequency must be greater than 0');
      return false;
    }

    if (formData.break_duration_mins <= 0) {
      setError('Break duration must be greater than 0');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    const { error: saveError } = await updateProfile(formData);

    if (saveError) {
      setError(saveError.message || 'Failed to save profile');
      setSaving(false);
    } else {
      setIsEditing(false);
      setSaving(false);
    }
  };

  if (!profile) {
    return (
      <div className={styles.profile}>
        <h1>My Profile</h1>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className={styles.profile}>
      <header className={styles.header}>
        <div>
          <h1>My Profile</h1>
          <p className={styles.email}>{user?.email}</p>
        </div>
        {!isEditing && (
          <Button variant="secondary" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
      </header>

      <div className={styles.content}>
        <Card padding="lg">
          <CardContent>
            <h2 className={styles.sectionTitle}>Recovery Preferences</h2>

            {!isEditing ? (
              <div className={styles.formGroup}>
                <label className={styles.label}>Recovery Style</label>
                <p className={styles.value}>{profile.recovery_style}</p>
              </div>
            ) : (
              <Select
                label="Recovery Style"
                name="recovery_style"
                value={formData.recovery_style}
                onChange={handleInputChange}
              >
                <option value="">Select a recovery style</option>
                {RECOVERY_STYLES.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </Select>
            )}

            <h2 className={styles.sectionTitle}>Work Schedule</h2>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Workday Start</label>
                {!isEditing ? (
                  <p className={styles.value}>{profile.workday_start}</p>
                ) : (
                  <Input
                    type="time"
                    name="workday_start"
                    value={formData.workday_start}
                    onChange={handleInputChange}
                  />
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Workday End</label>
                {!isEditing ? (
                  <p className={styles.value}>{profile.workday_end}</p>
                ) : (
                  <Input
                    type="time"
                    name="workday_end"
                    value={formData.workday_end}
                    onChange={handleInputChange}
                    error={error?.includes('End time') ? error : ''}
                  />
                )}
              </div>
            </div>

            <h2 className={styles.sectionTitle}>Break Configuration</h2>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Focus Block Duration (minutes)</label>
                {!isEditing ? (
                  <p className={styles.value}>{profile.break_frequency_mins}</p>
                ) : (
                  <Input
                    type="number"
                    name="break_frequency_mins"
                    value={formData.break_frequency_mins}
                    onChange={handleInputChange}
                    min="1"
                  />
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Break Duration (minutes)</label>
                {!isEditing ? (
                  <p className={styles.value}>{profile.break_duration_mins}</p>
                ) : (
                  <Input
                    type="number"
                    name="break_duration_mins"
                    value={formData.break_duration_mins}
                    onChange={handleInputChange}
                    min="1"
                  />
                )}
              </div>
            </div>

            <h2 className={styles.sectionTitle}>Notifications</h2>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="reminder_enabled"
                  checked={isEditing ? formData.reminder_enabled : profile.reminder_enabled}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <span>Enable break reminders</span>
              </label>
            </div>

            {error && (
              <div className={styles.error}>{error}</div>
            )}

            {isEditing && (
              <div className={styles.actions}>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setError(null);
                    setFormData({
                      recovery_style: profile.recovery_style,
                      workday_start: profile.workday_start,
                      workday_end: profile.workday_end,
                      break_frequency_mins: profile.break_frequency_mins,
                      break_duration_mins: profile.break_duration_mins,
                      reminder_enabled: profile.reminder_enabled,
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
