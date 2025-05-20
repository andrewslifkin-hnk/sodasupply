'use client';

import { useEffect, useState } from 'react';

// Define client-side flags
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Using a simple approach without Hypertune
    // In a real app, you could fetch from an API endpoint or local storage
    
    // Simulate some user-specific flags
    if (userId) {
      // This is just a simple example - you would replace with real flag logic
      const isTestUser = userId.includes('test') || userId.includes('admin');
      
      setFlags({
        [newNavigation.key]: isTestUser, // Enable new navigation for test users
        [checkoutExperiment.key]: isTestUser ? 'variant_a' : 'control',
      });
    }
    
    setLoading(false);
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