import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const UserDataContext = createContext({});

const RECOVERY_STYLES = [
  'Social Recharger',
  'Solo Decompressor',
  'Physical Resetter',
  'Mental Unplugger'
];

const defaultProfile = {
  recovery_style: null,
  workday_start: '09:00',
  workday_end: '17:00',
  break_frequency_mins: 90,
  break_duration_mins: 15,
  onboarding_completed: false,
  reminder_enabled: false,
};

export function UserDataProvider({ children }) {
  const { user, supabase } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile when user changes
  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (profileData) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          ...defaultProfile,
          ...profileData,
        })
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    }
  };

  const updateProfile = async (updates) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    }
  };

  const completeOnboarding = async (recoveryStyle, workSettings) => {
    const profileData = {
      recovery_style: recoveryStyle,
      workday_start: workSettings.workdayStart,
      workday_end: workSettings.workdayEnd,
      break_frequency_mins: workSettings.breakFrequency,
      break_duration_mins: workSettings.breakDuration,
      onboarding_completed: true,
    };

    if (profile) {
      return updateProfile(profileData);
    } else {
      return createProfile(profileData);
    }
  };

  const value = {
    profile,
    loading,
    error,
    createProfile,
    updateProfile,
    completeOnboarding,
    refreshProfile: fetchProfile,
    RECOVERY_STYLES,
    needsOnboarding: !loading && (!profile || !profile.onboarding_completed),
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
}
