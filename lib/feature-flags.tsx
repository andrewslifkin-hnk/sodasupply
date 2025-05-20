'use client';

import { flag } from 'flags/next';
import { useEffect, useState } from 'react';
import { getHypertune } from './hypertune';

// Define some example feature flags using Vercel Flags
export const newNavigation = flag<boolean>({
  key: 'new-navigation',
  decide() {
    return false; // Default value
  },
});

export const checkoutExperiment = flag<string>({
  key: 'checkout-experiment',
  decide() {
    return 'control'; // Default value (could be 'control', 'variantA', 'variantB')
  },
});

// A hook for accessing Hypertune flags in client components
export function useHypertune(userId?: string) {
  const [flags, setFlags] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadHypertune() {
      try {
        setLoading(true);
        const hypertuneClient = await getHypertune({
          userId,
          environment: process.env.NODE_ENV,
        });
        
        setFlags(hypertuneClient);
      } catch (err) {
        console.error('Failed to load Hypertune flags:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    }

    loadHypertune();
  }, [userId]);

  return { flags, loading, error };
}

// Example component using the feature flags
export function FeatureFlagExample({ userId }: { userId?: string }) {
  // Using Vercel Flags
  const [isNewNavEnabled, setIsNewNavEnabled] = useState(false);
  const [checkoutVariant, setCheckoutVariant] = useState('control');
  
  // Using Hypertune
  const { flags: hypertuneFlags, loading } = useHypertune(userId);

  useEffect(() => {
    // Load Vercel Flags
    async function loadFlags() {
      const navEnabled = await newNavigation();
      const checkout = await checkoutExperiment();
      
      setIsNewNavEnabled(navEnabled);
      setCheckoutVariant(checkout);
    }
    
    loadFlags();
  }, []);

  if (loading) {
    return <div>Loading feature flags...</div>;
  }

  return (
    <div className="p-4 border rounded">
      <h2 className="text-lg font-bold">Feature Flag Status</h2>
      
      <div className="mt-4">
        <h3 className="font-medium">Vercel Flags:</h3>
        <ul className="mt-2 space-y-1">
          <li>New Navigation: {isNewNavEnabled ? 'Enabled ✅' : 'Disabled ❌'}</li>
          <li>Checkout Experiment: {checkoutVariant}</li>
        </ul>
      </div>
      
      {hypertuneFlags && (
        <div className="mt-4">
          <h3 className="font-medium">Hypertune Flags:</h3>
          <div className="mt-2 text-sm opacity-75">
            <p>Check your Hypertune schema for available flags</p>
            {/* Example: {hypertuneFlags.yourFlag({ fallback: false }) ? 'Enabled' : 'Disabled'} */}
          </div>
        </div>
      )}
    </div>
  );
} 