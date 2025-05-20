import { createFeatureGate, trackEvent } from '../../../flags';
import Link from 'next/link';

export default async function ServerFeatureFlagsDemo() {
  // Use the feature gate directly in a server component
  const myFeatureGateEnabled = await createFeatureGate("my_first_gate")();
  
  // Track server-side page view (Note: this happens on each request)
  await trackEvent('server_page_view', {
    page: 'feature-flags-demo/server',
    timestamp: new Date().toISOString(),
    isServer: true
  });
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Server-Side Feature Flags Demo</h1>
      
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Custom Feature Flags (Server Component)</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">my_first_gate</h3>
          <div className="flex items-center space-x-2">
            <span className={`inline-block w-3 h-3 rounded-full ${myFeatureGateEnabled ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span>Status: {myFeatureGateEnabled ? 'Enabled' : 'Disabled'}</span>
          </div>
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
        <h2 className="text-xl font-semibold mb-4">Server-Side Analytics</h2>
        <p>
          This demo tracks a page view event when the page is rendered on the server.
          Check your logs in the terminal to see these server-side events.
        </p>
        <p className="mt-4 text-sm text-gray-500">
          Note: Unlike client-side events that batch together, server-side events log immediately.
        </p>
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded border border-gray-200">
        <h2 className="text-lg font-medium mb-2">About Server-Side Feature Flags</h2>
        <p className="text-gray-700">
          This is a server-side component that evaluates feature flags during server-side rendering.
          Our analytics system works in both client and server environments.
        </p>
        <p className="mt-2 text-gray-700">
          The flag status above is controlled by the "my_first_gate" feature gate in our flags.ts file.
        </p>
      </div>
      
      <div className="mt-4">
        <Link href="/feature-flags-demo" className="text-blue-600 hover:underline">
          View Client-Side Demo
        </Link>
      </div>
    </div>
  );
} 