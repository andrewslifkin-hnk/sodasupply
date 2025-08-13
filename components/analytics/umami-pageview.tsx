"use client"
import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function UmamiPageView() {
  const pathname = usePathname()
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).umami && pathname) {
      ;(window as any).umami.track("page_view", { pathname })
    }
  }, [pathname])
  return null
}


