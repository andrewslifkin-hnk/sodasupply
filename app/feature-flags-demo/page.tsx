'use client';

import { useState, useEffect } from 'react';
import { createFeatureGate, trackEvent, logConversion, flushEvents } from '../../flags';

// Custom hook to handle the async feature flag
function useFeatureFlag(flagKey: string) {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkFlag() {
      try {
        const flagEnabled = await createFeatureGate(flagKey)();
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

  return { enabled, loading };
}

export default function FeatureFlagsDemo() {
  const { enabled: myFeatureGateEnabled, loading } = useFeatureFlag("my_first_gate");
  
  // Track page view when component loads
  useEffect(() => {
    trackEvent('page_view', {
      page: 'feature-flags-demo',
      timestamp: new Date().toISOString()
    });
    
    // Cleanup function to flush events when navigating away
    return () => {
      flushEvents();
    };
  }, []);
  
  // Example function to track button click
  const handleButtonClick = () => {
    trackEvent('button_click', {
      buttonId: 'demo-button',
      action: 'test_analytics'
    });
    
    // Show alert to confirm the event was tracked
    alert('Event tracked! Check your console for details.');
  };
  
  // Example function to track a conversion
  const handleConversion = () => {
    logConversion('demo_conversion', 1, {
      source: 'demo-page',
      conversionType: 'test'
    });
    
    // Show alert to confirm the conversion was tracked
    alert('Conversion tracked! Check your console for details.');
  };
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Feature Flags Demo</h1>
      
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Custom Feature Flags</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">my_first_gate</h3>
          {loading ? (
            <p>Loading feature flag status...</p>
          ) : (
            <div className="flex items-center space-x-2">
              <span className={`inline-block w-3 h-3 rounded-full ${myFeatureGateEnabled ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span>Status: {myFeatureGateEnabled ? 'Enabled' : 'Disabled'}</span>
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
      </div>
      
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Analytics Demo</h2>
        <p className="mb-4">
          This demo shows how to use custom analytics with our feature flags. 
          Event tracking automatically works with feature flag evaluations.
        </p>
        
        <div className="flex space-x-4 mt-6">
          <button 
            onClick={handleButtonClick}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Track Custom Event
          </button>
          
          <button 
            onClick={handleConversion}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Track Conversion
          </button>
          
          <button 
            onClick={() => flushEvents()}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            Flush Events
          </button>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          Open your browser console to see the tracked events
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded border border-gray-200">
        <h2 className="text-lg font-medium mb-2">About Custom Feature Flags</h2>
        <p className="text-gray-700">
          This demo uses a custom feature flags implementation compatible with Vercel Edge runtime.
          It includes an analytics system that tracks feature flag exposures and custom events.
        </p>
        <p className="mt-2 text-gray-700">
          The flag status above is controlled by the "my_first_gate" feature gate configured in our flags.ts file.
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