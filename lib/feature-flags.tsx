'use client';

import { useEffect, useState } from 'react';
import { getHypertune } from './hypertune';

// Define client-side flags without using server-only modules
type FlagDefinition<T> = {
  key: string;
  defaultValue: T;
};

// Simple client feature flags
export const newNavigation: FlagDefinition<boolean> = {
  key: 'new-navigation',
  defaultValue: false,
};

export const checkoutExperiment: FlagDefinition<string> = {
  key: 'checkout-experiment',
  defaultValue: 'control',
};

// A hook for accessing feature flags in client components
export function useFeatureFlags(userId?: string) {
  const [flags, setFlags] = useState<Record<string, any>>({
    // Set defaults directly
    [newNavigation.key]: newNavigation.defaultValue,
    [checkoutExperiment.key]: checkoutExperiment.defaultValue,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadFlags() {
      try {
        // Attempt to load the flags from Hypertune
        const hypertuneClient = await getHypertune({
          userId,
        });

        if (hypertuneClient) {
          // In a real implementation, we would get real flags here
          // For now, just use the defaults
          setFlags({
            [newNavigation.key]: hypertuneClient.getFlag(newNavigation.key) || newNavigation.defaultValue,
            [checkoutExperiment.key]: hypertuneClient.getFlag(checkoutExperiment.key) || checkoutExperiment.defaultValue,
          });
        }

        setLoading(false);
      } catch (err: any) {
        console.error('Error loading feature flags:', err);
        setError(err);
        setLoading(false);
      }
    }

    loadFlags();
  }, [userId]);

  return {
    flags,
    loading,
    error,
  };
}

// Export a sample component to demonstrate flag usage
export function FeatureFlagExample({ userId }: { userId?: string }) {
  const { flags, loading, error } = useFeatureFlags(userId);

  if (loading) return <div>Loading flags...</div>;
  if (error) return <div>Error loading flags: {error.message}</div>;

  return (
    <div className="p-4 border rounded shadow-sm">
      <h2 className="text-xl font-bold mb-4">Feature Flags</h2>
      
      <div className="space-y-2">
        <div>
          <strong>New Navigation:</strong> {flags[newNavigation.key] ? 'Enabled' : 'Disabled'}
        </div>
        
        <div>
          <strong>Checkout Experiment:</strong> {flags[checkoutExperiment.key]}
        </div>
      </div>
    </div>
  );
} 