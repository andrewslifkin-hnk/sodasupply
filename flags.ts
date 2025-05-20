// flags.ts
// Simple feature flag implementation compatible with Vercel Edge

type StatsigUser = {
  userID: string;
  email?: string;
  country?: string;
  userType?: string;
  [key: string]: any;
};

// Event data structure
type EventData = {
  eventName: string;
  userId: string;
  metadata?: Record<string, any>;
  timestamp?: number;
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

// Simple feature flag client with analytics
class FeatureFlagClient {
  private static instance: FeatureFlagClient;
  private cache: Record<string, boolean> = {};
  private events: EventData[] = [];
  private flushInterval: NodeJS.Timeout | null = null;
  private flushIntervalMs = 10000; // 10 seconds
  
  private constructor() {
    // Set up periodic event flushing if in a browser environment
    if (typeof window !== 'undefined') {
      this.flushInterval = setInterval(() => this.flushEvents(), this.flushIntervalMs);
    }
  }
  
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
      
      // Log exposure
      this.logExposure(key, result);
      
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
  
  // Log exposure to a feature flag
  private logExposure(key: string, value: boolean) {
    const user = getUserInfo();
    this.trackEvent('exposure', user.userID, {
      featureKey: key,
      value: value,
      reason: 'cached',
    });
  }
  
  // Track a custom event
  public trackEvent(eventName: string, userId: string, metadata?: Record<string, any>) {
    const event: EventData = {
      eventName,
      userId,
      metadata,
      timestamp: Date.now()
    };
    
    this.events.push(event);
    
    // If we have too many events, flush immediately
    if (this.events.length >= 100) {
      this.flushEvents();
    }
    
    // Log to console for debugging
    console.log(`Event tracked: ${eventName}`, metadata);
  }
  
  // Flush events to server
  public async flushEvents() {
    if (this.events.length === 0) return;
    
    // Copy events and clear the queue
    const eventsToSend = [...this.events];
    this.events = [];
    
    try {
      // In a production system, you'd send these to your analytics endpoint
      console.log(`Flushing ${eventsToSend.length} events`);
      
      // Example implementation (commented out)
      // const response = await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ events: eventsToSend })
      // });
      
      // For now, just log to console in a formatted way
      eventsToSend.forEach(event => {
        console.log(`[ANALYTICS] ${event.timestamp} | ${event.userId} | ${event.eventName}`, event.metadata);
      });
    } catch (error) {
      console.error('Failed to send events:', error);
      // Add events back to the queue
      this.events = [...eventsToSend, ...this.events];
    }
  }
  
  // Clean up resources
  public cleanup() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    // Flush any remaining events
    this.flushEvents();
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

// Function to track custom events
export const trackEvent = (
  eventName: string, 
  metadata?: Record<string, any>
) => {
  const user = getUserInfo();
  const client = FeatureFlagClient.getInstance();
  client.trackEvent(eventName, user.userID, metadata);
};

// Function to log a conversion event
export const logConversion = (
  eventName: string, 
  value?: number, 
  metadata?: Record<string, any>
) => {
  trackEvent(eventName, {
    ...metadata,
    value: value,
    conversion: true
  });
};

// Force flush events immediately
export const flushEvents = async () => {
  const client = FeatureFlagClient.getInstance();
  await client.flushEvents();
}; 