// flags.ts
// Simple feature flag implementation compatible with Vercel Edge

type StatsigUser = {
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

// Simple feature flag client
class FeatureFlagClient {
  private static instance: FeatureFlagClient;
  private cache: Record<string, boolean> = {};
  
  private constructor() {}
  
  public static getInstance(): FeatureFlagClient {
    if (!FeatureFlagClient.instance) {
      FeatureFlagClient.instance = new FeatureFlagClient();
    }
    return FeatureFlagClient.instance;
  }
  
  // Simplified feature gate check
  public async checkFeatureGate(key: string): Promise<boolean> {
    // If we've already checked this flag, return the cached value
    if (this.cache[key] !== undefined) {
      return this.cache[key];
    }
    
    try {
      // In a real implementation, this would call to Statsig's API
      // For demo purposes, we'll just return true for specific gate keys
      const knownFlags: Record<string, boolean> = {
        'my_first_gate': true,
        'my_test_gate': false
      };
      
      // Default to false if the flag isn't defined
      const result = knownFlags[key] || false;
      
      // Cache the result
      this.cache[key] = result;
      
      // Log exposure (in a real implementation)
      console.log(`Feature flag ${key} evaluated to ${result}`);
      
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
}

// Simplified implementation of the feature gate function
export const createFeatureGate = (key: string) => {
  return async (): Promise<boolean> => {
    const client = FeatureFlagClient.getInstance();
    return await client.checkFeatureGate(key);
  };
};

// Export user identification function (similar API to before)
export const identify = async (): Promise<StatsigUser> => {
  const userInfo = getUserInfo();
  return {
    ...userInfo,
    userID: userInfo.userID || "default-user-id" // Fallback if userID is empty
  };
}; 