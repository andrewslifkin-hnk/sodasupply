// flags.ts
import { statsigAdapter, type StatsigUser } from "@flags-sdk/statsig";
import { flag, dedupe } from "flags/next";
import type { Identify } from "flags";

// Function to get user info - in a real app, this might come from authentication
const getUserInfo = () => {
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

export const identify = dedupe((async () => {
  // Get user information from your auth system
  const userInfo = getUserInfo();
  
  // Ensure we always have a valid userID
  return {
    ...userInfo,
    userID: userInfo.userID || "default-user-id" // Fallback if userID is empty
  };
}) satisfies Identify<StatsigUser>);

export const createFeatureGate = (key: string) => flag<boolean, StatsigUser>({
  key,
  adapter: statsigAdapter.featureGate((gate) => gate.value, {exposureLogging: true}),
  identify,
}); 