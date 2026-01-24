import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserData } from '../../contexts/UserDataContext';
import { WorkdayConfig } from '../../components/daily/WorkdayConfig';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import styles from './SettingsPage.module.css';

export function SettingsPage() {
  const { user, signOut } = useAuth();
  const { profile } = useUserData();
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

      <Card>
        <h2 className={styles.sectionTitle}>Work Schedule</h2>
        <WorkdayConfig />
      </Card>
    </div>
  );
}
