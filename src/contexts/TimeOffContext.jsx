import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const TimeOffContext = createContext({});

const DEMO_ENTRIES = [
  {
    id: '1',
    user_id: 'demo-user-12345',
    occasion: 'Summer Vacation',
    start_date: '2025-07-01',
    end_date: '2025-07-14',
    status: 'Planned',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: 'demo-user-12345',
    occasion: 'Thanksgiving',
    start_date: '2025-11-27',
    end_date: '2025-11-30',
    status: 'Planned',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    user_id: 'demo-user-12345',
    occasion: 'Holiday Break',
    start_date: '2025-12-20',
    end_date: '2026-01-05',
    status: 'Planned',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function TimeOffProvider({ children }) {
  const { user, isDemo, supabase } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      if (isDemo) {
        // Use demo entries
        setEntries(DEMO_ENTRIES);
        setLoading(false);
      } else {
        fetchEntries();
      }
    } else {
      setEntries([]);
      setLoading(false);
    }
  }, [user, isDemo]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      if (!supabase) throw new Error('Supabase not configured');

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
      if (isDemo) {
        // Mock entry creation
        const newEntry = {
          id: Math.random().toString(),
          user_id: user.id,
          occasion: entry.occasion,
          start_date: entry.startDate,
          end_date: entry.endDate,
          status: entry.status || 'Planned',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setEntries(prev => [...prev, newEntry].sort((a, b) =>
          new Date(a.start_date) - new Date(b.start_date)
        ));
        return { data: newEntry, error: null };
      }

      if (!supabase) throw new Error('Supabase not configured');

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
      if (isDemo) {
        // Mock entry update
        const updatedEntry = {
          ...entries.find(e => e.id === id),
          occasion: updates.occasion,
          start_date: updates.startDate,
          end_date: updates.endDate,
          status: updates.status,
          updated_at: new Date().toISOString(),
        };
        setEntries(prev =>
          prev.map(e => e.id === id ? updatedEntry : e)
            .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
        );
        return { data: updatedEntry, error: null };
      }

      if (!supabase) throw new Error('Supabase not configured');

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
      if (isDemo) {
        // Mock entry deletion
        setEntries(prev => prev.filter(e => e.id !== id));
        return { error: null };
      }

      if (!supabase) throw new Error('Supabase not configured');

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
