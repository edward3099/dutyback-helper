import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { PolicyDocument, PolicyChange } from '@/lib/policy-monitor';

export function usePolicyMonitor() {
  const [policies, setPolicies] = useState<PolicyDocument[]>([]);
  const [changes, setChanges] = useState<PolicyChange[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPolicies = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('policy_documents')
        .select('*')
        .eq('status', 'active')
        .order('updated_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      setPolicies(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch policies');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchChanges = useCallback(async (limit: number = 10) => {
    try {
      const { data, error } = await supabase
        .from('policy_changes')
        .select(`
          *,
          policy_documents (
            title,
            url,
            category
          )
        `)
        .order('detected_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(error.message);
      }

      setChanges(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch changes');
    }
  }, []);

  const getChangesBySeverity = useCallback((severity: PolicyChange['severity']) => {
    return changes.filter(change => change.severity === severity);
  }, [changes]);

  const getChangesByCategory = useCallback((category: PolicyDocument['category']) => {
    return changes.filter(change => 
      change.policy_documents && 
      change.policy_documents.category === category
    );
  }, [changes]);

  const getRecentChanges = useCallback((days: number = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return changes.filter(change => 
      new Date(change.detected_at) >= cutoffDate
    );
  }, [changes]);

  useEffect(() => {
    fetchPolicies();
    fetchChanges();
  }, [fetchPolicies, fetchChanges]);

  return {
    policies,
    changes,
    isLoading,
    error,
    fetchPolicies,
    fetchChanges,
    getChangesBySeverity,
    getChangesByCategory,
    getRecentChanges
  };
}

export function usePolicyChanges() {
  const [changes, setChanges] = useState<PolicyChange[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChanges = useCallback(async (limit: number = 50) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('policy_changes')
        .select(`
          *,
          policy_documents (
            title,
            url,
            category
          )
        `)
        .order('detected_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(error.message);
      }

      setChanges(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch changes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCriticalChanges = useCallback(() => {
    return changes.filter(change => change.severity === 'critical');
  }, [changes]);

  const getUserAffectingChanges = useCallback(() => {
    return changes.filter(change => change.affects_users);
  }, [changes]);

  const getChangesByType = useCallback((type: PolicyChange['changeType']) => {
    return changes.filter(change => change.change_type === type);
  }, [changes]);

  useEffect(() => {
    fetchChanges();
  }, [fetchChanges]);

  return {
    changes,
    isLoading,
    error,
    fetchChanges,
    getCriticalChanges,
    getUserAffectingChanges,
    getChangesByType
  };
}
