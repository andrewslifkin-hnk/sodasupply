"use client"

import { useEffect, useState } from "react"
import Statsig from "statsig-js"

import { FilterSheet } from "./filter-sheet"
import { FilterBar } from "./filter-bar"
import { useMediaQuery } from "@/hooks/use-media-query"

const EXPERIMENT_KEY = "filters_static_sidebar"
let statsigInitialized = false

function getSidebarOverride(): boolean | null {
  if (typeof window === "undefined") return null
  const params = new URLSearchParams(window.location.search)
  const override = params.get("filters_static_sidebar")
  if (override === "on") return true
  if (override === "off") return false
  return null
}

// ExperimentedFiltersLayout: provides sidebar and a slot for quick filters/products
export function ExperimentedFiltersLayout({ children }: { children: React.ReactNode }) {
  const [showStaticSidebar, setShowStaticSidebar] = useState(false)
  const [loading, setLoading] = useState(true)
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  useEffect(() => {
    const override = getSidebarOverride()
    if (override !== null) {
      setShowStaticSidebar(override && isDesktop)
      setLoading(false)
      return
    }
    async function checkExperiment() {
      if (!statsigInitialized && typeof window !== "undefined") {
        await Statsig.initialize(process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY!, { userID: "anonymous" })
        statsigInitialized = true
      }
      const experiment = Statsig.getExperiment(EXPERIMENT_KEY)
      setShowStaticSidebar(experiment.get("show_sidebar", false) && isDesktop)
      setLoading(false)
    }
    checkExperiment()
  }, [isDesktop])

  if (typeof window === "undefined" || loading) return null

  if (showStaticSidebar) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm sticky top-24 h-fit max-h-[calc(100vh-6rem)] overflow-hidden">
            <FilterSheet staticSidebar />
          </div>
        </div>
        <div className="lg:col-span-3 flex flex-col gap-4">
          {children}
        </div>
      </div>
    )
  }

  // Default: show filter bar and sheet (mobile/experiment off)
  return (
    <>
      <FilterBar />
      <FilterSheet />
      {children}
    </>
  )
}

// Default export for backwards compatibility (sidebar only)
export function ExperimentedFiltersSidebar() {
  // This is now just the sidebar for legacy use
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm sticky top-4 h-fit max-h-[calc(100vh-6rem)] overflow-hidden">
      <FilterSheet staticSidebar />
    </div>
  )
} 