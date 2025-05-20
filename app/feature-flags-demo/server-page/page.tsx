import { createFeatureGate, identify } from '../../../flags';

export default async function ServerFeatureFlagsDemo() {
  // Get user information
  const user = await identify();
  
  // Use the feature gate directly in a server component with user context
  const myFeatureGateEnabled = await createFeatureGate("my_first_gate")(user);
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Server-Side Feature Flags Demo</h1>
      
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Statsig Feature Flags (Server Component)</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">my_first_gate</h3>
          <div className="flex items-center space-x-2">
            <span className={`inline-block w-3 h-3 rounded-full ${myFeatureGateEnabled ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span>Status: {myFeatureGateEnabled ? 'Enabled' : 'Disabled'}</span>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Checking for user: {user.userID}
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
      
      <div className="mt-8 p-4 bg-gray-50 rounded border border-gray-200">
        <h2 className="text-lg font-medium mb-2">About Statsig Feature Flags</h2>
        <p className="text-gray-700">
          This is a server-side component that evaluates feature flags during server-side rendering.
        </p>
        <p className="mt-2 text-gray-700">
          The flag status above is controlled by the "my_first_gate" feature gate in Statsig.
        </p>
      </div>
      
      <div className="mt-4">
        <a href="/feature-flags-demo" className="text-blue-600 hover:underline">
          View Client-Side Demo
        </a>
      </div>
    </div>
  );
} 