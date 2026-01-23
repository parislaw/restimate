import { useState, useMemo } from 'react';
import { useUserData } from '../../contexts/UserDataContext';
import { ActionCard } from './ActionCard';
import { ActionFilter } from './ActionFilter';
import { Card } from '../ui/Card';
import recoveryActions from '../../data/recoveryActions.json';
import styles from './ActionLibrary.module.css';

export function ActionLibrary() {
  const { profile } = useUserData();
  const [filters, setFilters] = useState({
    duration: 'all',
    energy: 'all',
    style: 'recommended',
  });

  const filteredActions = useMemo(() => {
    return recoveryActions.filter((action) => {
      // Duration filter
      if (filters.duration !== 'all') {
        const maxDuration = parseInt(filters.duration);
        if (action.duration_mins > maxDuration) return false;
      }

      // Energy filter
      if (filters.energy !== 'all') {
        if (action.energy_level !== filters.energy) return false;
      }

      // Style filter
      if (filters.style === 'recommended') {
        if (!action.recovery_styles.includes(profile?.recovery_style)) return false;
      } else if (filters.style !== 'all') {
        if (!action.recovery_styles.includes(filters.style)) return false;
      }

      return true;
    });
  }, [filters, profile?.recovery_style]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className={styles.library}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Action Library</h1>
          <p className={styles.subtitle}>
            Recovery activities matched to your style
          </p>
        </div>
      </header>

      <ActionFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        recoveryStyle={profile?.recovery_style}
      />

      <div className={styles.results}>
        <p className={styles.count}>
          {filteredActions.length} action{filteredActions.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {filteredActions.length > 0 ? (
        <div className={styles.grid}>
          {filteredActions.map((action) => (
            <ActionCard
              key={action.id}
              action={action}
              isRecommended={action.recovery_styles.includes(profile?.recovery_style)}
            />
          ))}
        </div>
      ) : (
        <Card padding="lg" className={styles.emptyState}>
          <div className={styles.emptyContent}>
            <span className={styles.emptyIcon}>🔍</span>
            <h3 className={styles.emptyTitle}>No actions match your filters</h3>
            <p className={styles.emptyMessage}>
              Try adjusting your filters to see more recovery actions.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
