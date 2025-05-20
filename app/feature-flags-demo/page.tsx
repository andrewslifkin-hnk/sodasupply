'use client';

import { useState } from 'react';
import { FeatureFlagExample } from '@/lib/feature-flags';

export default function FeatureFlagsDemo() {
  const [userId, setUserId] = useState('');
  const [inputValue, setInputValue] = useState('');
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Feature Flags Demo</h1>
      
      <div className="mb-8 flex items-end gap-4">
        <div className="w-full max-w-xs">
          <label htmlFor="user-id" className="block mb-2 text-sm font-medium">
            User ID (for personalized flags)
          </label>
          <input
            id="user-id"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="border rounded p-2 w-full"
            placeholder="Enter user ID"
          />
        </div>
        <button
          onClick={() => setUserId(inputValue)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Update User
        </button>
      </div>
      
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Current User</h2>
          <div className="px-3 py-2 bg-gray-100 rounded">
            {userId ? userId : <span className="text-gray-500">No user selected</span>}
          </div>
        </div>
        
        <FeatureFlagExample userId={userId || undefined} />
      </div>
      
      <div className="mt-8 text-sm text-gray-600">
        <p className="mb-2">
          <strong>Note:</strong> This demo shows how to use feature flags in your application.
        </p>
        <p>
          Before using Hypertune flags, make sure to:
        </p>
        <ol className="list-decimal pl-5 mt-2 space-y-1">
          <li>Create a Hypertune account and project</li>
          <li>Add your Hypertune token to .env.local</li>
          <li>Run <code className="bg-gray-100 px-1.5 py-0.5 rounded">npx hypertune</code> to generate the client</li>
          <li>Define your feature flag schema in the Hypertune dashboard</li>
        </ol>
      </div>
    </div>
  );
} 