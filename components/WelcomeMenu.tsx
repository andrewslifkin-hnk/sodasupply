"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"
import { useFilter, FilterType } from "@/context/filter-context"
import Statsig from "statsig-js"

const MENU_EXPERIMENT = "welcome_menu_experiment"

function CupIcon() {
  return (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 3h14v2a7 7 0 01-14 0V3z"/><path d="M12 21v-4"/><path d="M8 21h8"/></svg>
  )
}
function ListIcon() {
  return (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M9 3v2"/><path d="M15 3v2"/><path d="M8 11h8"/><path d="M8 15h6"/></svg>
  )
}
function TagIcon() {
  return (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.59 7.59a2 2 0 01-2.83 0l-7.59-7.59a2 2 0 010-2.83l7.59-7.59a2 2 0 012.83 0l7.59 7.59a2 2 0 010 2.83z"/><circle cx="12" cy="12" r="3"/></svg>
  )
}
function ArrowRightIcon() {
  return (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>
  )
}
function ChevronDownIcon() {
  return (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
  )
}
function ChevronUpIcon() {
  return (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6"/></svg>
  )
}

export default function WelcomeMenu() {
  const isMobile = useIsMobile()
  const router = useRouter()
  const { addFilter, clearAllFilters } = useFilter()
  const [expanded, setExpanded] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const [loading, setLoading] = useState(true)
  const menuRef = useRef<HTMLDivElement>(null)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  // Statsig experiment gating
  useEffect(() => {
    async function checkExperiment() {
      await ensureStatsigInitialized()
      const experiment = Statsig.getExperiment(MENU_EXPERIMENT)
      const shouldShow = experiment.get("show_menu", true)
      setShowMenu(shouldShow)
      setLoading(false)
      if (shouldShow) {
        Statsig.logEvent("welcome_menu_exposed")
      }
    }
    checkExperiment()
  }, [])

  // Scroll/collapse logic
  useEffect(() => {
    if (!expanded) return
    if (!isMobile) return
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY
          if (scrollY > 20 && expanded) {
            setExpanded(false)
          }
          lastScrollY.current = scrollY
          ticking.current = false
        })
        ticking.current = true
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [expanded, isMobile])

  // Expand when scrolled to top
  useEffect(() => {
    if (!isMobile) return
    const handleScroll = () => {
      if (window.scrollY < 10 && !expanded) {
        setExpanded(true)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [expanded, isMobile])

  // Animation: slide/opacity for expanded content only
  const expandedStyle: React.CSSProperties = {
    transition:
      "max-height 0.6s cubic-bezier(.4,0,.2,1), " +
      "opacity 0.5s cubic-bezier(.4,0,.2,1), " +
      "margin-top 0.5s cubic-bezier(.4,0,.2,1)",
    maxHeight: expanded ? 1000 : 0,
    opacity: expanded ? 1 : 0,
    marginTop: expanded ? 0 : -16,
    pointerEvents: expanded ? "auto" : "none",
    overflow: "hidden",
    willChange: "max-height, opacity, margin-top",
  }

  // Scroll to All Products title
  const scrollToProducts = useCallback(() => {
    const el = document.querySelector("h1.text-2xl.font-bold")
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [])

  // Button handlers
  const handleLoyalty = () => {
    Statsig.logEvent("welcome_menu_loyalty_clicked")
    router.push("/club")
  }
  const handleOrders = () => {
    Statsig.logEvent("welcome_menu_orders_clicked")
    router.push("/orders")
  }
  const handleMostPurchased = () => {
    Statsig.logEvent("welcome_menu_most_purchased_clicked")
    clearAllFilters()
    addFilter({
      id: "type-frequently-purchased",
      label: "Frequently purchased",
      category: "type",
      type: FilterType.CHECKBOX,
      value: "Frequently purchased",
    })
    setTimeout(scrollToProducts, 100)
  }
  const handleStartShopping = () => {
    Statsig.logEvent("welcome_menu_start_shopping_clicked")
    clearAllFilters()
    setTimeout(scrollToProducts, 100)
  }

  if (!isMobile || loading || !showMenu) return null

  return (
    <div
      ref={menuRef}
      className="rounded-t-2xl rounded-b-3xl bg-[#F3F5F3] px-4 pt-8 pb-4 mb-4 shadow-md"
      aria-label="Welcome menu"
    >
      {/* Always visible top section */}
      <div className="flex flex-col items-center text-center">
        <h2 className="text-2xl font-bold text-[#202020]">Welcome to eazle!</h2>
        <p className="text-lg text-[#202020]/80 mb-2">Let's get you started</p>
        {!expanded && (
          <button
            className="font-semibold text-[#202020] py-2 flex items-center gap-1"
            aria-expanded={expanded}
            aria-controls="welcome-menu-content"
            onClick={() => setExpanded(true)}
          >
            Show menu <ChevronDownIcon />
          </button>
        )}
      </div>
      {/* Animated expanded content */}
      <div
        id="welcome-menu-content"
        style={expandedStyle}
        aria-hidden={!expanded}
      >
        <div className="flex flex-col gap-3 mb-4 mt-2">
          <button
            className="flex items-center justify-between w-full bg-white rounded-xl px-4 py-4 text-lg font-semibold text-[#202020] shadow-sm"
            onClick={handleMostPurchased}
            aria-label="Your most purchased"
            aria-expanded={expanded}
            aria-controls="welcome-menu-content"
          >
            <span className="flex items-center gap-3"><CupIcon />Your most purchased</span>
            <ArrowRightIcon />
          </button>
          <button
            className="flex items-center justify-between w-full bg-white rounded-xl px-4 py-4 text-lg font-semibold text-[#202020] shadow-sm"
            onClick={handleOrders}
            aria-label="View your orders"
            aria-expanded={expanded}
            aria-controls="welcome-menu-content"
          >
            <span className="flex items-center gap-3"><ListIcon />View your orders</span>
            <ArrowRightIcon />
          </button>
          <button
            className="flex items-center justify-between w-full bg-white rounded-xl px-4 py-4 text-lg font-semibold text-[#202020] shadow-sm"
            onClick={handleLoyalty}
            aria-label="Check your loyalty points"
            aria-expanded={expanded}
            aria-controls="welcome-menu-content"
          >
            <span className="flex items-center gap-3"><TagIcon />Check your loyalty points</span>
            <ArrowRightIcon />
          </button>
        </div>
        <button
          className="w-full bg-[#003D40] text-white rounded-full py-4 text-lg font-semibold mb-2 shadow"
          onClick={handleStartShopping}
          aria-label="Start shopping"
          aria-expanded={expanded}
          aria-controls="welcome-menu-content"
        >
          Start shopping
        </button>
        <button
          className="block mx-auto mt-2 text-[#202020] font-semibold flex items-center gap-1"
          onClick={() => setExpanded(false)}
          aria-expanded={expanded}
          aria-controls="welcome-menu-content"
        >
          Hide menu <ChevronUpIcon />
        </button>
      </div>
    </div>
  )
}

// Statsig init helper (copy from promotional-banner)
let statsigInitialized = false
let statsigInitPromise: Promise<void> | null = null
async function ensureStatsigInitialized() {
  if (typeof window !== "undefined") {
    if (!statsigInitialized) {
      if (!statsigInitPromise) {
        let sessionId = sessionStorage.getItem("statsigDisplaySessionId")
        if (!sessionId) {
          sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36)
          sessionStorage.setItem("statsigDisplaySessionId", sessionId)
        }
        statsigInitPromise = Statsig.initialize(
          process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY!,
          { userID: sessionId }
        )
      }
      await statsigInitPromise
      statsigInitialized = true
    }
  }
} 