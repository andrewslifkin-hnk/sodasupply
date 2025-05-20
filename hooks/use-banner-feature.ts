'use client';

import { useState, useEffect } from 'react';
import { createFeatureGate, identify } from '@/flags';
import type { StatsigUser } from '@/flags';

export function useBannerFeature() {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function checkBannerFlag() {
      try {
        // Get user identity
        const userInfo = await identify();
        
        // Check banner carousel feature flag with user context
        const bannerFeatureEnabled = await createFeatureGate("banner_carousel")(userInfo);
        setEnabled(bannerFeatureEnabled);
      } catch (error) {
        console.error('Error checking banner feature flag:', error);
        setEnabled(false);
      } finally {
        setLoading(false);
      }
    }
    
    checkBannerFlag();
  }, []);

  return { enabled, loading };
} 