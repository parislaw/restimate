import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import styles from './Login.module.css';

export default function Login() {
  const { demoLogin } = useAuth();

  const handleDemoMode = () => {
    demoLogin();
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Restimate</h1>
          <p className={styles.tagline}>Plan your rest. Transform your recovery.</p>
        </div>

        <div className={styles.content}>
          <p className={styles.description}>
            Design your recovery proactively. Break cycles of burnout with intentional rest planning.
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.icon}>⏱️</span>
              <span>Daily break planning</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.icon}>📅</span>
              <span>Annual time-off tracking</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.icon}>✨</span>
              <span>Personalized recovery actions</span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Button onClick={handleDemoMode} variant="primary" size="large">
            Enter Demo Mode
          </Button>
          <p className={styles.demoNote}>
            Demo mode uses sample data to showcase the app.
          </p>
        </div>
      </div>
    </div>
  );
}
