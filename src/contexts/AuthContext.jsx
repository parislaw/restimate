import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const AuthContext = createContext({});

const DEMO_USER = {
  id: 'demo-user-12345',
  email: 'demo@restimate.com',
  user_metadata: { name: 'Demo User' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    // Check for demo mode
    const demoMode = localStorage.getItem('restimate_demo_mode');
    if (demoMode === 'true') {
      setUser(DEMO_USER);
      setIsDemo(true);
      setLoading(false);
    } else if (supabase) {
      // Get initial session from Supabase
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // No Supabase configured and not in demo mode
      setLoading(false);
    }
  }, []);

  const signUp = async (email, password) => {
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  };

  const signIn = async (email, password) => {
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signInWithMagicLink = async (email) => {
    if (!supabase) return { data: null, error: new Error('Supabase not configured') };

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/app/daily`,
      },
    });
    return { data, error };
  };

  const signOut = async () => {
    if (isDemo) {
      localStorage.removeItem('restimate_demo_mode');
      setUser(null);
      setIsDemo(false);
      return { error: null };
    }

    if (!supabase) return { error: new Error('Supabase not configured') };

    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const demoLogin = () => {
    localStorage.setItem('restimate_demo_mode', 'true');
    setUser(DEMO_USER);
    setIsDemo(true);
  };

  const value = {
    user,
    loading,
    isDemo,
    signUp,
    signIn,
    signInWithMagicLink,
    signOut,
    demoLogin,
    supabase,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
