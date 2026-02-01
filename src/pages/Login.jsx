import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import styles from './Login.module.css';

export default function Login() {
  const navigate = useNavigate();
  const { demoLogin, signUp, signIn } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.email) {
      setError('Email is required');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const { error: authError } = isSignUp
      ? await signUp(formData.email, formData.password)
      : await signIn(formData.email, formData.password);

    if (authError) {
      setError(authError.message || 'Authentication failed');
      setLoading(false);
    } else {
      navigate('/app/daily');
    }
  };

  const handleDemoMode = () => {
    demoLogin();
    navigate('/app/daily');
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

          <form className={styles.authForm} onSubmit={handleSubmit}>
            <h2 className={styles.formTitle}>
              {isSignUp ? 'Create Account' : 'Sign In'}
            </h2>

            <Input
              type="email"
              name="email"
              label="Email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
              error={error?.includes('email') || error?.includes('Email') ? error : ''}
            />

            <Input
              type="password"
              name="password"
              label="Password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              disabled={loading}
              error={error && !error.includes('email') && !error.includes('Email') ? error : ''}
            />

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
            </Button>

            <div className={styles.toggleMode}>
              <span>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </span>
              <button
                type="button"
                className={styles.toggleButton}
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                  setFormData({ email: '', password: '' });
                }}
                disabled={loading}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          </form>

          <div className={styles.divider}>
            <span>or</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            onClick={handleDemoMode}
            variant="secondary"
            size="large"
            fullWidth
            disabled={loading}
          >
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
