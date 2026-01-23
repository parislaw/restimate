import { useState } from 'react';
import { Card, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Tag } from '../ui/Tag';
import { Modal } from '../ui/Modal';
import styles from './ActionCard.module.css';

const energyIcons = {
  low: '🌿',
  medium: '⚡',
  high: '🔥',
};

export function ActionCard({ action, isRecommended }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Card variant="default" padding="md" hoverable>
        <CardContent>
          <div className={styles.header}>
            <div className={styles.meta}>
              <span className={styles.duration}>⏱️ {action.duration_mins} min</span>
              <span className={styles.energy}>
                {energyIcons[action.energy_level]} {action.energy_level}
              </span>
            </div>
            {isRecommended && (
              <Tag variant="primary" size="sm">Recommended</Tag>
            )}
          </div>

          <h3 className={styles.title}>{action.title}</h3>
          <p className={styles.description}>{action.description}</p>

          <div className={styles.tags}>
            {action.tags.map((tag) => (
              <Tag key={tag} variant="default" size="sm">
                {tag}
              </Tag>
            ))}
          </div>
        </CardContent>

        <CardFooter>
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={() => setShowModal(true)}
          >
            Try Now
          </Button>
        </CardFooter>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={action.title}
      >
        <div className={styles.modalContent}>
          <div className={styles.modalMeta}>
            <span className={styles.modalMetaItem}>
              ⏱️ {action.duration_mins} minutes
            </span>
            <span className={styles.modalMetaItem}>
              {energyIcons[action.energy_level]} {action.energy_level} energy
            </span>
          </div>

          <div className={styles.modalSection}>
            <h4 className={styles.modalSectionTitle}>How to do it</h4>
            <p className={styles.modalDescription}>{action.description}</p>
          </div>

          <div className={styles.modalSection}>
            <h4 className={styles.modalSectionTitle}>Best for</h4>
            <div className={styles.modalStyles}>
              {action.recovery_styles.map((style) => (
                <Tag key={style} variant="primary" size="md">
                  {style}
                </Tag>
              ))}
            </div>
          </div>

          <div className={styles.modalSection}>
            <h4 className={styles.modalSectionTitle}>Tips</h4>
            <ul className={styles.tips}>
              <li>Set a timer so you can fully relax</li>
              <li>Put your phone on do-not-disturb</li>
              <li>Don't worry about doing it "perfectly"</li>
            </ul>
          </div>

          <div className={styles.modalActions}>
            <Button fullWidth onClick={() => setShowModal(false)}>
              Got it, I'll try this!
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
