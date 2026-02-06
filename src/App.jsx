import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UserDataProvider } from './contexts/UserDataContext';
import { TimeOffProvider } from './contexts/TimeOffContext';
import { TutorialProvider } from './contexts/TutorialContext';
import { AppShell, OnboardingShell } from './components/layout/AppShell';
import { Landing } from './pages/Landing';
import { Login } from './components/auth/Login';
import { Signup } from './components/auth/Signup';
import { OnboardingContainer } from './components/onboarding/OnboardingContainer';
import { DailyPage } from './pages/app/DailyPage';
import { TimeOffPage } from './pages/app/TimeOffPage';
import { ActionsPage } from './pages/app/ActionsPage';
import { SettingsPage } from './pages/app/SettingsPage';
import { Tutorial } from './components/tutorial/Tutorial';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserDataProvider>
          <TimeOffProvider>
            <TutorialProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Onboarding route */}
                <Route element={<OnboardingShell />}>
                  <Route path="/app/onboarding" element={<OnboardingContainer />} />
                </Route>

                {/* Protected app routes */}
                <Route element={<AppShell />}>
                  <Route path="/app/daily" element={<DailyPage />} />
                  <Route path="/app/timeoff" element={<TimeOffPage />} />
                  <Route path="/app/actions" element={<ActionsPage />} />
                  <Route path="/app/settings" element={<SettingsPage />} />
                  <Route path="/app" element={<Navigate to="/app/daily" replace />} />
                </Route>

                {/* Catch all - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Tutorial />
            </TutorialProvider>
          </TimeOffProvider>
        </UserDataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
