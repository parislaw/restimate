import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useUserData } from './contexts/UserDataContext';
import { AppShell, OnboardingShell } from './components/layout/AppShell';
import { DailyPlanner } from './components/daily/DailyPlanner';
import { YearView } from './components/timeoff/YearView';
import { ActionLibrary } from './components/actions/ActionLibrary';
import { OnboardingContainer } from './components/onboarding/OnboardingContainer';
import Login from './pages/Login';

function AppRoutes() {
  const { user, loading: authLoading } = useAuth();
  const { loading: userLoading } = useUserData();

  if (authLoading || userLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>
          <div style={{ width: '50px', height: '50px', border: '4px solid #e0e0e0', borderTop: '4px solid #333', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }} />
          <p>Loading your rest plan...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <Routes>
      {!user ? (
        <Route path="*" element={<Login />} />
      ) : (
        <>
          <Route path="/app" element={<AppShell />}>
            <Route path="daily" element={<DailyPlanner />} />
            <Route path="year" element={<YearView />} />
            <Route path="actions" element={<ActionLibrary />} />
            <Route index element={<Navigate to="/app/daily" replace />} />
          </Route>
          <Route path="/app/onboarding" element={<OnboardingShell />}>
            <Route index element={<OnboardingContainer />} />
          </Route>
          <Route path="*" element={<Navigate to="/app" replace />} />
        </>
      )}
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
