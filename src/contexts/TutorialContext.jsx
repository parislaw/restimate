import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUserData } from './UserDataContext';

const TutorialContext = createContext({});

// Define tutorial steps for each page
const TUTORIAL_STEPS = {
  daily: [
    {
      target: null,
      position: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
      icon: '📅',
      title: 'Welcome to Daily Planner',
      description: 'This is your command center for managing breaks throughout your workday. Let\'s take a quick tour!',
      tip: null,
    },
    {
      target: '[data-tutorial="workday-config"]',
      position: { top: '20%', left: '50%', transform: 'translateX(-50%)' },
      icon: '⚙️',
      title: 'Configure Your Workday',
      description: 'Set your work hours and preferred break frequency. The app will automatically suggest breaks based on your rhythm.',
      tip: 'Most people benefit from 10-15 minute breaks every 90 minutes.',
    },
    {
      target: '[data-tutorial="break-timeline"]',
      position: { top: '30%', right: '20px' },
      icon: '⏰',
      title: 'Your Break Timeline',
      description: 'See all your scheduled breaks for the day in a visual timeline. Click on any break to log it or adjust timing.',
      tip: 'Green checkmarks show breaks you\'ve completed.',
    },
    {
      target: '[data-tutorial="break-suggestions"]',
      position: { bottom: '100px', right: '20px' },
      icon: '💡',
      title: 'Break Suggestions',
      description: 'Get personalized activity suggestions based on your recovery style. Activities are tailored to your energy level and available time.',
      tip: 'Try different activities to discover what works best for you.',
    },
  ],
  timeoff: [
    {
      target: null,
      position: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
      icon: '🌴',
      title: 'Time-Off Planning',
      description: 'Plan your vacations, personal days, and longer recovery periods throughout the year.',
      tip: null,
    },
    {
      target: '[data-tutorial="year-view"]',
      position: { top: '20%', left: '50%', transform: 'translateX(-50%)' },
      icon: '📆',
      title: 'Year at a Glance',
      description: 'Visualize your entire year of time off. This helps you distribute recovery periods evenly and avoid burnout.',
      tip: 'Aim for at least one week of vacation every quarter.',
    },
    {
      target: '[data-tutorial="add-timeoff"]',
      position: { top: '20%', right: '20px' },
      icon: '➕',
      title: 'Add Time Off',
      description: 'Click here to add new vacation days, personal time, or sick leave. The calendar will update automatically.',
      tip: 'Plan time off in advance to give yourself something to look forward to.',
    },
    {
      target: '[data-tutorial="timeoff-list"]',
      position: { bottom: '100px', left: '20px' },
      icon: '📋',
      title: 'Your Time-Off List',
      description: 'All your planned time off in one place. Edit or delete entries as your plans change.',
      tip: 'Mark important dates like holidays and family events.',
    },
  ],
  actions: [
    {
      target: null,
      position: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
      icon: '🎯',
      title: 'Recovery Action Library',
      description: 'Discover activities designed to help you recharge effectively during breaks and time off.',
      tip: null,
    },
    {
      target: '[data-tutorial="action-filters"]',
      position: { top: '20%', left: '20px' },
      icon: '🔍',
      title: 'Filter Activities',
      description: 'Filter by duration, energy level, and recovery style to find activities that fit your current needs.',
      tip: 'Try activities outside your usual style - variety helps prevent recovery burnout.',
    },
    {
      target: '[data-tutorial="action-cards"]',
      position: { top: '30%', right: '20px' },
      icon: '💫',
      title: 'Action Cards',
      description: 'Each card shows an activity with tags for quick reference. Click for more details and tips.',
      tip: 'Save your favorites for quick access later.',
    },
  ],
  settings: [
    {
      target: null,
      position: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
      icon: '⚙️',
      title: 'Settings',
      description: 'Customize your experience and manage your account preferences.',
      tip: null,
    },
    {
      target: '[data-tutorial="work-schedule"]',
      position: { top: '30%', left: '50%', transform: 'translateX(-50%)' },
      icon: '🕐',
      title: 'Work Schedule',
      description: 'Update your work hours and break preferences anytime. The app will recalculate your break schedule.',
      tip: 'Adjust settings as your work patterns change.',
    },
  ],
};

export function TutorialProvider({ children }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentPage, setCurrentPage] = useState('daily');
  const { profile, updateProfile } = useUserData();
  const location = useLocation();

  // Determine which page we're on
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/daily')) setCurrentPage('daily');
    else if (path.includes('/timeoff')) setCurrentPage('timeoff');
    else if (path.includes('/actions')) setCurrentPage('actions');
    else if (path.includes('/settings')) setCurrentPage('settings');
  }, [location]);

  // Auto-start tutorial for new users after onboarding
  useEffect(() => {
    if (profile && profile.onboarding_completed && !profile.tutorial_completed) {
      // Small delay to let the page render
      const timer = setTimeout(() => {
        startTutorial();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [profile]);

  const startTutorial = (page = null) => {
    setCurrentPage(page || currentPage);
    setCurrentStep(0);
    setIsActive(true);
  };

  const nextStep = () => {
    const steps = TUTORIAL_STEPS[currentPage] || [];
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTutorial = async () => {
    setIsActive(false);
    setCurrentStep(0);
    if (profile && !profile.tutorial_completed) {
      await updateProfile({ tutorial_completed: true });
    }
  };

  const completeTutorial = async () => {
    setIsActive(false);
    setCurrentStep(0);
    if (profile && !profile.tutorial_completed) {
      await updateProfile({ tutorial_completed: true });
    }
  };

  const restartTutorial = () => {
    setCurrentStep(0);
    setIsActive(true);
  };

  const steps = TUTORIAL_STEPS[currentPage] || [];

  const value = {
    isActive,
    currentStep,
    currentPage,
    steps,
    startTutorial,
    nextStep,
    previousStep,
    skipTutorial,
    completeTutorial,
    restartTutorial,
  };

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
}
