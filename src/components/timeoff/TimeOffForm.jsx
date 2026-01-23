import { useState, useEffect } from 'react';
import { useTimeOff } from '../../contexts/TimeOffContext';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import styles from './TimeOffForm.module.css';

const statusOptions = [
  { value: 'Planned', label: 'Planned' },
  { value: 'Tentative', label: 'Tentative' },
  { value: 'Confirmed', label: 'Confirmed' },
];

const occasionSuggestions = [
  'Vacation',
  'Holiday',
  'Personal Day',
  'Mental Health Day',
  'Family Time',
  'Long Weekend',
  'Staycation',
];

export function TimeOffForm({ entry, onClose }) {
  const { addEntry, updateEntry } = useTimeOff();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    occasion: '',
    startDate: '',
    endDate: '',
    status: 'Planned',
  });

  useEffect(() => {
    if (entry) {
      setFormData({
        occasion: entry.occasion,
        startDate: entry.start_date,
        endDate: entry.end_date,
        status: entry.status,
      });
    }
  }, [entry]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (entry) {
      await updateEntry(entry.id, formData);
    } else {
      await addEntry(formData);
    }

    setLoading(false);
    onClose();
  };

  const isValid = formData.occasion && formData.startDate && formData.endDate;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input
        label="Occasion"
        placeholder="e.g., Summer Vacation"
        value={formData.occasion}
        onChange={(e) => handleChange('occasion', e.target.value)}
        required
      />

      <div className={styles.suggestions}>
        {occasionSuggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            className={styles.suggestionChip}
            onClick={() => handleChange('occasion', suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>

      <div className={styles.dateRow}>
        <Input
          type="date"
          label="Start Date"
          value={formData.startDate}
          onChange={(e) => handleChange('startDate', e.target.value)}
          required
        />
        <Input
          type="date"
          label="End Date"
          value={formData.endDate}
          min={formData.startDate}
          onChange={(e) => handleChange('endDate', e.target.value)}
          required
        />
      </div>

      <Select
        label="Status"
        value={formData.status}
        onChange={(e) => handleChange('status', e.target.value)}
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>

      <div className={styles.actions}>
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={loading} disabled={!isValid}>
          {entry ? 'Update' : 'Add'} Time Off
        </Button>
      </div>
    </form>
  );
}
