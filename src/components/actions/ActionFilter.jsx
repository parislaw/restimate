import { Select } from '../ui/Input';
import { Card } from '../ui/Card';
import styles from './ActionFilter.module.css';

const durationOptions = [
  { value: 'all', label: 'Any duration' },
  { value: '5', label: '5 min or less' },
  { value: '10', label: '10 min or less' },
  { value: '15', label: '15 min or less' },
  { value: '20', label: '20 min or less' },
];

const energyOptions = [
  { value: 'all', label: 'Any energy level' },
  { value: 'low', label: 'Low energy' },
  { value: 'medium', label: 'Medium energy' },
  { value: 'high', label: 'High energy' },
];

const styleOptions = [
  { value: 'recommended', label: 'Recommended for me' },
  { value: 'all', label: 'All styles' },
  { value: 'Social Recharger', label: 'Social Recharger' },
  { value: 'Solo Decompressor', label: 'Solo Decompressor' },
  { value: 'Physical Resetter', label: 'Physical Resetter' },
  { value: 'Mental Unplugger', label: 'Mental Unplugger' },
];

export function ActionFilter({ filters, onFilterChange, recoveryStyle }) {
  return (
    <Card padding="md" variant="flat" className={styles.filters}>
      <div className={styles.filterGrid}>
        <Select
          label="Duration"
          value={filters.duration}
          onChange={(e) => onFilterChange('duration', e.target.value)}
        >
          {durationOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>

        <Select
          label="Energy Level"
          value={filters.energy}
          onChange={(e) => onFilterChange('energy', e.target.value)}
        >
          {energyOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>

        <Select
          label="Recovery Style"
          value={filters.style}
          onChange={(e) => onFilterChange('style', e.target.value)}
        >
          {styleOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
              {opt.value === 'recommended' && recoveryStyle
                ? ` (${recoveryStyle})`
                : ''}
            </option>
          ))}
        </Select>
      </div>
    </Card>
  );
}
