import { useEffect, useState, useRef } from 'react';
import { useTutorial } from '../../contexts/TutorialContext';
import { Button } from '../ui/Button';
import styles from './Tutorial.module.css';

export function Tutorial() {
  const {
    isActive,
    currentStep,
    steps,
    nextStep,
    previousStep,
    skipTutorial,
    completeTutorial,
  } = useTutorial();

  const [spotlightStyle, setSpotlightStyle] = useState({});
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!isActive || !steps[currentStep]) return;

    const step = steps[currentStep];
    if (step.target) {
      const targetElement = document.querySelector(step.target);
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const padding = 8;

        setSpotlightStyle({
          top: rect.top - padding,
          left: rect.left - padding,
          width: rect.width + padding * 2,
          height: rect.height + padding * 2,
        });

        // Scroll element into view if needed
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      setSpotlightStyle({});
    }
  }, [isActive, currentStep, steps]);

  if (!isActive || !steps[currentStep]) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      completeTutorial();
    } else {
      nextStep();
    }
  };

  return (
    <>
      {/* Dark overlay */}
      <div className={styles.overlay} ref={overlayRef} onClick={skipTutorial} />

      {/* Spotlight highlight */}
      {step.target && spotlightStyle.width && (
        <div
          className={styles.spotlight}
          style={spotlightStyle}
        />
      )}

      {/* Tutorial card */}
      <div
        className={styles.card}
        style={{
          top: step.position?.top,
          bottom: step.position?.bottom,
          left: step.position?.left,
          right: step.position?.right,
        }}
      >
        <div className={styles.header}>
          <div className={styles.progress}>
            <span className={styles.stepNumber}>
              Step {currentStep + 1} of {steps.length}
            </span>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
          <button
            className={styles.closeButton}
            onClick={skipTutorial}
            aria-label="Close tutorial"
          >
            ×
          </button>
        </div>

        <div className={styles.content}>
          {step.icon && <div className={styles.icon}>{step.icon}</div>}
          <h3 className={styles.title}>{step.title}</h3>
          <p className={styles.description}>{step.description}</p>
          {step.tip && (
            <div className={styles.tip}>
              💡 <strong>Tip:</strong> {step.tip}
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <Button
            variant="secondary"
            size="sm"
            onClick={skipTutorial}
          >
            Skip Tutorial
          </Button>
          <div className={styles.navigation}>
            {!isFirstStep && (
              <Button
                variant="secondary"
                size="sm"
                onClick={previousStep}
              >
                Back
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleNext}
            >
              {isLastStep ? 'Get Started' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
