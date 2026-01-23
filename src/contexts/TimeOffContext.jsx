import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const TimeOffContext = createContext({});

export function TimeOffProvider({ children }) {
  const { user, supabase } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchEntries();
    } else {
      setEntries([]);
      setLoading(false);
    }
  }, [user]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('time_off_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: true });

      if (error) throw error;
      setEntries(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addEntry = async (entry) => {
    try {
      const { data, error } = await supabase
        .from('time_off_entries')
        .insert({
          user_id: user.id,
          occasion: entry.occasion,
          start_date: entry.startDate,
          end_date: entry.endDate,
          status: entry.status || 'Planned',
        })
        .select()
        .single();

      if (error) throw error;
      setEntries(prev => [...prev, data].sort((a, b) =>
        new Date(a.start_date) - new Date(b.start_date)
      ));
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    }
  };

  const updateEntry = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('time_off_entries')
        .update({
          occasion: updates.occasion,
          start_date: updates.startDate,
          end_date: updates.endDate,
          status: updates.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setEntries(prev =>
        prev.map(e => e.id === id ? data : e)
          .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
      );
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    }
  };

  const deleteEntry = async (id) => {
    try {
      const { error } = await supabase
        .from('time_off_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setEntries(prev => prev.filter(e => e.id !== id));
      return { error: null };
    } catch (err) {
      setError(err.message);
      return { error: err };
    }
  };

  const value = {
    entries,
    loading,
    error,
    addEntry,
    updateEntry,
    deleteEntry,
    refreshEntries: fetchEntries,
  };

  return (
    <TimeOffContext.Provider value={value}>
      {children}
    </TimeOffContext.Provider>
  );
}

export function useTimeOff() {
  const context = useContext(TimeOffContext);
  if (!context) {
    throw new Error('useTimeOff must be used within a TimeOffProvider');
  }
  return context;
}
