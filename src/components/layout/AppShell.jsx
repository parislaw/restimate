import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useUserData } from '../../contexts/UserDataContext';
import { Sidebar } from './Sidebar';
import styles from './AppShell.module.css';

export function AppShell() {
  const { user, loading: authLoading } = useAuth();
  const { needsOnboarding, loading: userLoading } = useUserData();

  // Show loading state
  if (authLoading || userLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p className={styles.loadingText}>Loading your rest plan...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Redirect to onboarding if not completed
  if (needsOnboarding) {
    return <Navigate to="/app/onboarding" replace />;
  }

  return (
    <div className={styles.appShell}>
      <Sidebar />
      <main className={styles.main}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

// Wrapper for onboarding that doesn't require completed onboarding
export function OnboardingShell() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: userLoading } = useUserData();

  if (authLoading || userLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p className={styles.loadingText}>Setting up your experience...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If onboarding is already completed, redirect to daily planner
  if (profile?.onboarding_completed) {
    return <Navigate to="/app/daily" replace />;
  }

  return (
    <div className={styles.onboardingShell}>
      <Outlet />
    </div>
  );
}
