// flags.ts
// Feature flag implementation using Statsig

import Statsig from 'statsig-node';

export type StatsigUser = {
  userID: string;
  email?: string;
  country?: string;
  userType?: string;
  [key: string]: any;
};

// Function to get user info - in a real app, this might come from authentication
const getUserInfo = (): StatsigUser => {
  // In production, you would get this from your auth system
  // For now, using a consistent ID for testing
  return {
    userID: "test-user-123",
    // You can add additional properties that Statsig can use for targeting
    email: "test@example.com",
    country: "US",
    // Custom properties
    userType: "tester"
  };
};

// Improved feature flag client with actual Statsig integration
class FeatureFlagClient {
  private static instance: FeatureFlagClient;
  private cache: Record<string, boolean> = {};
  private initialized: boolean = false;
  private initializing: Promise<void> | null = null;
  
  private constructor() {}
  
  public static getInstance(): FeatureFlagClient {
    if (!FeatureFlagClient.instance) {
      FeatureFlagClient.instance = new FeatureFlagClient();
    }
    return FeatureFlagClient.instance;
  }
  
  // Initialize Statsig with the API key
  private async initialize() {
    if (this.initialized || this.initializing) {
      return this.initializing;
    }
    
    this.initializing = (async () => {
      try {
        // Get API key from environment variables
        const apiKey = process.env.STATSIG_SERVER_API_KEY;
        
        if (!apiKey) {
          console.warn('STATSIG_SERVER_API_KEY not found in environment variables. Using fallback values.');
          this.initialized = true;
          return;
        }
        
        // Initialize Statsig
        await Statsig.initialize(apiKey);
        this.initialized = true;
        console.log('Statsig initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Statsig:', error);
        // Still mark as initialized to prevent repeated attempts
        this.initialized = true;
      }
    })();
    
    return this.initializing;
  }
  
  // Feature gate check using Statsig
  public async checkFeatureGate(key: string, user?: StatsigUser): Promise<boolean> {
    // If we've already checked this flag, return the cached value
    const cacheKey = `${key}:${user?.userID || 'default'}`;
    if (this.cache[cacheKey] !== undefined) {
      return this.cache[cacheKey];
    }
    
    try {
      // Make sure Statsig is initialized
      await this.initialize();
      
      let result = false;
      
      // Use the provided user or get default user
      const statsigUser = user || getUserInfo();
      
      if (this.initialized && process.env.STATSIG_SERVER_API_KEY) {
        // Check the feature gate using Statsig SDK
        result = await Statsig.checkGate(statsigUser, key);
      } else {
        // Fallback to hardcoded values if Statsig is not available
        const fallbackFlags: Record<string, boolean> = {
          'my_first_gate': true,
          'my_test_gate': false
        };
        result = fallbackFlags[key] || false;
      }
      
      // Cache the result
      this.cache[cacheKey] = result;
      
      console.log(`Feature flag ${key} evaluated to ${result} for user ${statsigUser.userID}`);
      
      return result;
    } catch (error) {
      console.error(`Error checking feature flag ${key}:`, error);
      return false;
    }
  }
  
  // Clear cache
  public clearCache() {
    this.cache = {};
  }
  
  // Shutdown Statsig client
  public async shutdown() {
    try {
      if (this.initialized && process.env.STATSIG_SERVER_API_KEY) {
        await Statsig.shutdown();
      }
    } catch (error) {
      console.error('Error shutting down Statsig:', error);
    }
  }
}

// Feature gate function
export const createFeatureGate = (key: string) => {
  return async (user?: StatsigUser): Promise<boolean> => {
    const client = FeatureFlagClient.getInstance();
    return await client.checkFeatureGate(key, user);
  };
};

// Export user identification function
export const identify = async (): Promise<StatsigUser> => {
  const userInfo = getUserInfo();
  return {
    ...userInfo,
    userID: userInfo.userID || "default-user-id" // Fallback if userID is empty
  };
}; 