import * as hypertune from "hypertune";
import { flag } from "flags/next";

// This file will be created by the Hypertune CLI
// We're importing it dynamically to avoid build errors if it doesn't exist yet
let hypertuneSource: any;
try {
  const { createSource } = require("../generated/hypertune");
  hypertuneSource = createSource({
    token: process.env.HYPERTUNE_TOKEN || "",
  });
} catch (error) {
  console.warn("Hypertune client not generated yet. Run 'npx hypertune' to generate it.");
}

/**
 * Get Hypertune client with environment and user context
 */
export async function getHypertune(context?: {
  environment?: string;
  userId?: string;
  userInfo?: Record<string, any>;
}) {
  if (!hypertuneSource) {
    console.warn("Hypertune source not available");
    return null;
  }

  await hypertuneSource.initIfNeeded();

  return hypertuneSource.root({
    args: {
      context: {
        environment: context?.environment || process.env.NODE_ENV || "development",
        user: context?.userId 
          ? {
              id: context.userId,
              ...context.userInfo
            }
          : undefined
      },
    },
  });
}

/**
 * Utility function to create a feature flag with Flags SDK
 */
export function createFeatureFlag(key: string, defaultValue: boolean = false) {
  return flag<boolean>({
    key,
    decide() {
      // You can add logic here or call Hypertune
      return defaultValue;
    }
  });
} 