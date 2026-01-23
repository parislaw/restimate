import { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { getBreakSuggestion } from '../../hooks/useBreakSchedule';
import recoveryActions from '../../data/recoveryActions.json';
import styles from './BreakCard.module.css';

export function BreakCard({ breakData, recoveryStyle }) {
  const [showModal, setShowModal] = useState(false);

  const suggestion = getBreakSuggestion(breakData.startTime);

  // Get actions that match the user's recovery style
  const matchingActions = recoveryActions.filter((action) =>
    action.recovery_styles.includes(recoveryStyle) &&
    action.duration_mins <= breakData.duration
  );

  const suggestedAction = matchingActions[Math.floor(Math.random() * matchingActions.length)];

  return (
    <>
      <Card variant="default" padding="md" hoverable>
        <CardContent>
          <div className={styles.cardHeader}>
            <div className={styles.timeInfo}>
              <span className={styles.time}>{breakData.startTimeDisplay}</span>
              <span className={styles.duration}>{breakData.duration} min</span>
            </div>
            <span className={styles.badge}>{breakData.type}</span>
          </div>

          <div className={styles.suggestion}>
            <span className={styles.suggestionType}>{suggestion.type}</span>
            <p className={styles.suggestionMessage}>{suggestion.message}</p>
          </div>

          {suggestedAction && (
            <div className={styles.action}>
              <p className={styles.actionTitle}>Try: {suggestedAction.title}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowModal(true)}
              >
                View Details
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {suggestedAction && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={suggestedAction.title}
        >
          <div className={styles.modalContent}>
            <div className={styles.modalMeta}>
              <span className={styles.modalMetaItem}>
                ⏱️ {suggestedAction.duration_mins} minutes
              </span>
              <span className={styles.modalMetaItem}>
                ⚡ {suggestedAction.energy_level} energy
              </span>
            </div>
            <p className={styles.modalDescription}>{suggestedAction.description}</p>
            <div className={styles.modalTags}>
              {suggestedAction.tags.map((tag) => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
            <div className={styles.modalActions}>
              <Button fullWidth onClick={() => setShowModal(false)}>
                Got it!
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
