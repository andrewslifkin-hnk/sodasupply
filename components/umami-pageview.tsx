"use client"
import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function UmamiPageView() {
  const pathname = usePathname()
  useEffect(() => {
    if (typeof window !== "undefined" && window.umami && pathname) {
      window.umami.track("page_view", { pathname })
    }
  }, [pathname])
  return null
} 