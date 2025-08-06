'use client';

import { useState, useEffect } from 'react';
import { createFeatureGate, identify } from '../../flags';
import type { StatsigUser } from '../../flags';

// Custom hook to handle the async feature flag
function useFeatureFlag(flagKey: string) {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<StatsigUser | null>(null);

  useEffect(() => {
    async function checkFlag() {
      try {
        // Get user identity
        const userInfo = await identify();
        setUser(userInfo);
        
        // Check feature flag with user context
        const flagEnabled = await createFeatureGate(flagKey)(userInfo);
        setEnabled(flagEnabled);
      } catch (error) {
        console.error('Error checking feature flag:', error);
        setEnabled(false);
      } finally {
        setLoading(false);
      }
    }
    
    checkFlag();
  }, [flagKey]);

  return { enabled, loading, user };
}

export default function FeatureFlagsDemo() {
  const { enabled: myFeatureGateEnabled, loading, user } = useFeatureFlag("my_first_gate");
  const { enabled: mobileBottomNavEnabled, loading: mobileBottomNavLoading } = useFeatureFlag("mobile_bottom_nav");
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Feature Flags Demo</h1>
      
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Statsig Feature Flags</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">my_first_gate</h3>
          {loading ? (
            <p>Loading feature flag status...</p>
          ) : (
            <div>
              <div className="flex items-center space-x-2">
                <span className={`inline-block w-3 h-3 rounded-full ${myFeatureGateEnabled ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span>Status: {myFeatureGateEnabled ? 'Enabled' : 'Disabled'}</span>
              </div>
              {user && (
                <div className="mt-2 text-sm text-gray-500">
                  Checking for user: {user.userID}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border rounded bg-gray-50">
          <p>
            {myFeatureGateEnabled 
              ? "This feature is enabled! You can see this content because the feature flag is on."
              : "This feature is disabled. This content is hidden when the feature flag is off."}
          </p>
        </div>
        
        <div className="mb-6 mt-8">
          <h3 className="text-lg font-medium mb-2">mobile_bottom_nav</h3>
          {mobileBottomNavLoading ? (
            <p>Loading mobile bottom nav flag status...</p>
          ) : (
            <div>
              <div className="flex items-center space-x-2">
                <span className={`inline-block w-3 h-3 rounded-full ${mobileBottomNavEnabled ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span>Status: {mobileBottomNavEnabled ? 'Enabled' : 'Disabled'}</span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Controls whether the mobile bottom navigation bar is visible
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border rounded bg-gray-50">
          <p>
            {mobileBottomNavEnabled 
              ? "Mobile bottom navigation is enabled! Check on mobile devices to see the bottom nav bar."
              : "Mobile bottom navigation is disabled. The bottom nav bar will not appear on mobile devices."}
          </p>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded border border-gray-200">
        <h2 className="text-lg font-medium mb-2">About Statsig Feature Flags</h2>
        <p className="text-gray-700">
          This demo uses Statsig integration with Vercel feature flags. You can manage this flag in the Statsig console.
        </p>
        <p className="mt-2 text-gray-700">
          The flag status above is controlled by the "my_first_gate" feature gate in Statsig.
        </p>
      </div>
      
      <div className="mt-4">
        <a href="/feature-flags-demo/server-page" className="text-blue-600 hover:underline">
          View Server-Side Demo
        </a>
      </div>
    </div>
  );
} 