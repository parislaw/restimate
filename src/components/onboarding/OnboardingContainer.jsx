import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../../contexts/UserDataContext';
import { RecoveryAssessment } from './RecoveryAssessment';
import { WorkRhythmSetup } from './WorkRhythmSetup';
import styles from './OnboardingContainer.module.css';

export function OnboardingContainer() {
  const [step, setStep] = useState(1);
  const [recoveryStyle, setRecoveryStyle] = useState(null);
  const [loading, setLoading] = useState(false);
  const { completeOnboarding } = useUserData();
  const navigate = useNavigate();

  const handleAssessmentComplete = (style) => {
    setRecoveryStyle(style);
    setStep(2);
  };

  const handleWorkSetupComplete = async (workSettings) => {
    setLoading(true);
    const { error } = await completeOnboarding(recoveryStyle, workSettings);
    setLoading(false);

    if (!error) {
      navigate('/app/daily');
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.logo}>☯</span>
        <h1 className={styles.title}>Restimate</h1>
        <p className={styles.subtitle}>Let's design your rest plan</p>
      </div>

      <div className={styles.progress}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${(step / 2) * 100}%` }}
          />
        </div>
        <span className={styles.progressText}>Step {step} of 2</span>
      </div>

      <div className={styles.content}>
        {step === 1 && (
          <RecoveryAssessment onComplete={handleAssessmentComplete} />
        )}
        {step === 2 && (
          <WorkRhythmSetup
            onComplete={handleWorkSetupComplete}
            onBack={handleBack}
            recoveryStyle={recoveryStyle}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
