'use client';

import { useState } from 'react';
import { FeatureFlagExample } from '@/lib/feature-flags';

export default function FeatureFlagsDemo() {
  const [userId, setUserId] = useState('');
  const [inputValue, setInputValue] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserId(inputValue);
  };
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Feature Flags Demo</h1>
      
      <div className="mb-8">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md">
          <div className="flex-grow">
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
          <div className="self-end">
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Current Flags</h2>
        <div className="mb-2 text-sm text-gray-500">
          {userId ? `Showing flags for user: ${userId}` : 'Showing default flags'}
        </div>
        
        <FeatureFlagExample userId={userId} />
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded border border-gray-200">
        <h2 className="text-lg font-medium mb-2">About Feature Flags</h2>
        <p className="text-gray-700">
          This is a demonstration of client-side feature flags. In a real implementation, these would be connected to a feature flag service.
        </p>
      </div>
    </div>
  );
} 