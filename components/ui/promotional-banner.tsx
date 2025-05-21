"use client"

import { useState, useEffect } from "react"
import Statsig from "statsig-js"
import { Button } from "@/components/ui/button"
import { Tag } from "lucide-react"

let statsigInitialized = false;
let statsigInitPromise: Promise<void> | null = null;

async function ensureStatsigInitialized() {
  if (!statsigInitialized) {
    if (!statsigInitPromise) {
      statsigInitPromise = Statsig.initialize(
        process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY!,
        { userID: "test-user-123" }
      );
    }
    await statsigInitPromise;
    statsigInitialized = true;
  }
}

export function PromotionalBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkExperiment() {
      await ensureStatsigInitialized();
      const experiment = Statsig.getExperiment("promo_banner_experiment");
      const shouldShow = experiment.get("show_banner", false);
      setShowBanner(shouldShow);
      setLoading(false);
      if (shouldShow) {
        Statsig.logEvent("promo_banner_exposed");
      }
    }
    checkExperiment();
  }, []);

  const handleShopNowClick = () => {
    Statsig.logEvent("promo_banner_shop_now_clicked");
  }

  if (loading || !showBanner) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 mb-6 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-2 mb-2 md:mb-0">
          <Tag className="h-5 w-5" />
          <h3 className="font-bold">Limited Time Offer</h3>
        </div>
        <p className="text-sm md:text-base text-center md:text-left flex-1 mx-4">
          Free shipping on orders over €50! Use code <span className="font-bold">FREESHIP50</span> at checkout.
        </p>
        <Button
          variant="secondary"
          className="bg-white text-teal-600 hover:bg-gray-100 whitespace-nowrap"
          onClick={handleShopNowClick}
        >
          Shop Now
        </Button>
      </div>
    </div>
  )
} 