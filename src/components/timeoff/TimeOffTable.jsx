import { useState } from 'react';
import { useTimeOff } from '../../contexts/TimeOffContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Tag } from '../ui/Tag';
import { Modal } from '../ui/Modal';
import styles from './TimeOffTable.module.css';

export function TimeOffTable({ entries, onEdit }) {
  const { deleteEntry } = useTimeOff();
  const [deleteId, setDeleteId] = useState(null);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Confirmed': return 'success';
      case 'Tentative': return 'warning';
      default: return 'default';
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await deleteEntry(deleteId);
      setDeleteId(null);
    }
  };

  const entryToDelete = entries.find(e => e.id === deleteId);

  if (entries.length === 0) {
    return (
      <Card padding="lg" className={styles.emptyState}>
        <div className={styles.emptyContent}>
          <span className={styles.emptyIcon}>📅</span>
          <h3 className={styles.emptyTitle}>No time off planned yet</h3>
          <p className={styles.emptyMessage}>
            Add your planned vacations, holidays, or personal days to visualize your year.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card padding="none" className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Occasion</th>
            <th>Dates</th>
            <th>Days</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td className={styles.occasionCell}>
                <span className={styles.occasion}>{entry.occasion}</span>
              </td>
              <td className={styles.datesCell}>
                {formatDate(entry.start_date)} - {formatDate(entry.end_date)}
              </td>
              <td className={styles.daysCell}>
                {getDays(entry.start_date, entry.end_date)}
              </td>
              <td>
                <Tag variant={getStatusVariant(entry.status)}>
                  {entry.status}
                </Tag>
              </td>
              <td className={styles.actionsCell}>
                <Button variant="ghost" size="sm" onClick={() => onEdit(entry)}>
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteId(entry.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>

    <Modal
      isOpen={!!deleteId}
      onClose={() => setDeleteId(null)}
      title="Delete Time Off"
    >
      <div className={styles.deleteConfirm}>
        <p>
          Are you sure you want to delete <strong>{entryToDelete?.occasion}</strong>?
          This action cannot be undone.
        </p>
        <div className={styles.deleteActions}>
          <Button
            variant="ghost"
            onClick={() => setDeleteId(null)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
    </>
  );
}
