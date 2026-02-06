import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserData } from '../../contexts/UserDataContext';
import { useTutorial } from '../../contexts/TutorialContext';
import { WorkdayConfig } from '../../components/daily/WorkdayConfig';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import styles from './SettingsPage.module.css';

export function SettingsPage() {
  const { user, signOut } = useAuth();
  const { profile } = useUserData();
  const { startTutorial } = useTutorial();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
  };

  return (
    <div className={styles.settings}>
      <h1 className={styles.title}>Settings</h1>

      <Card>
        <h2 className={styles.sectionTitle}>Account</h2>
        <div className={styles.accountInfo}>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Recovery Style:</strong> {profile?.recovery_style || 'Not set'}</p>
        </div>
        <Button
          variant="danger"
          onClick={handleSignOut}
          loading={isSigningOut}
        >
          Sign Out
        </Button>
      </Card>

      <Card data-tutorial="work-schedule">
        <h2 className={styles.sectionTitle}>Work Schedule</h2>
        <WorkdayConfig />
      </Card>

      <Card>
        <h2 className={styles.sectionTitle}>Help & Tutorial</h2>
        <p className={styles.accountInfo}>
          Need a refresher? Replay the interactive tutorial to learn about all features.
        </p>
        <Button
          variant="secondary"
          onClick={() => startTutorial()}
        >
          Restart Tutorial
        </Button>
      </Card>
    </div>
  );
}
