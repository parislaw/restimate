import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import styles from './Landing.module.css';

export function Landing() {
  const { user } = useAuth();

  return (
    <div className={styles.landing}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>☯</span>
          <span className={styles.logoText}>Restimate</span>
        </div>
        <nav className={styles.nav}>
          {user ? (
            <Link to="/app/daily">
              <Button>Go to App</Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="secondary">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>
            Plan Your Recovery,<br />
            Protect Your Energy
          </h1>
          <p className={styles.subtitle}>
            Restimate helps you schedule intentional breaks, plan restorative time off,
            and maintain sustainable work rhythms.
          </p>
          <div className={styles.cta}>
            <Link to="/signup">
              <Button size="lg">Start Planning Your Rest</Button>
            </Link>
          </div>
        </section>

        <section className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>📅</div>
            <h3 className={styles.featureTitle}>Daily Break Planning</h3>
            <p className={styles.featureDescription}>
              Get personalized break schedules based on your work rhythm
            </p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🌴</div>
            <h3 className={styles.featureTitle}>Time-Off Mapping</h3>
            <p className={styles.featureDescription}>
              Visualize your annual recovery plan and avoid burnout
            </p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🎯</div>
            <h3 className={styles.featureTitle}>Recovery Actions</h3>
            <p className={styles.featureDescription}>
              Discover activities matched to your recovery style
            </p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>💡</div>
            <h3 className={styles.featureTitle}>Energy Insights</h3>
            <p className={styles.featureDescription}>
              Track patterns and optimize your rest strategy
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
