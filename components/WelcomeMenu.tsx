"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useFilter } from "@/context/filter-context"
import Statsig from "statsig-js"
import { useI18n } from "@/context/i18n-context"

interface FilterOption {
  id: string
  label: string
  category: string
  type: "checkbox" | "radio" | "range"
  value: string | number | [number, number] | boolean
}

enum FilterType {
  CHECKBOX = "checkbox",
  RADIO = "radio",
  RANGE = "range",
  TOGGLE = "toggle",
}

interface ChevronDownIconProps {
  className?: string
}

function ChevronDownIcon({ className }: ChevronDownIconProps) {
  return (
    <svg
      className={className}
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function ChevronUpIcon({ className }: ChevronUpIconProps) {
  return (
    <svg
      className={className}
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  )
}

interface ChevronUpIconProps {
  className?: string
}

function ArrowRightIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

function CupIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <line x1="6" x2="18" y1="2" y2="2" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  )
}

function TagIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.586 8.586a2 2 0 0 0 2.828 0l7.172-7.172a2 2 0 0 0 0-2.828z" />
      <path d="M7 7h.01" />
    </svg>
  )
}

export default function WelcomeMenu() {
  const [expanded, setExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const router = useRouter()
  const { clearAllFilters, addFilter } = useFilter()
  const { t } = useI18n()

  // Check if mobile and experiment on mount
  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth <= 768)
    }

    async function checkExperiment() {
      try {
        const experiment = Statsig.getExperiment("welcome_menu_experiment")
        const shouldShow = experiment.get("show_welcome_menu", false)
        setShowMenu(shouldShow)
        if (shouldShow) {
          Statsig.logEvent("welcome_menu_exposed")
        }
      } catch (error) {
        console.error("Error checking experiment:", error)
        setShowMenu(false)
      } finally {
        setLoading(false)
      }
    }

    checkMobile()
    checkExperiment()

    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

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
      className="rounded-t-2xl rounded-b-3xl bg-[#F3F5F3] px-4 pt-8 pb-4 mb-4 shadow-md"
      aria-label="Welcome menu"
    >
      {/* Always visible top section */}
      <div className="flex flex-col items-center text-center">
        <h2 className="text-2xl font-bold text-[#202020]">{t('welcome.welcome_to')}</h2>
        <p className="text-lg text-[#202020]/80 mb-2">{t('welcome.lets_get_started')}</p>
        {!expanded && (
          <button
            className="font-semibold text-[#202020] py-2 flex items-center gap-1"
            aria-expanded={expanded}
            aria-controls="welcome-menu-content"
            onClick={() => setExpanded(true)}
          >
            {t('common.show_menu')} <ChevronDownIcon />
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
            aria-label={t('welcome.your_most_purchased')}
            aria-expanded={expanded}
            aria-controls="welcome-menu-content"
          >
            <span className="flex items-center gap-3"><CupIcon />{t('welcome.your_most_purchased')}</span>
            <ArrowRightIcon />
          </button>
          <button
            className="flex items-center justify-between w-full bg-white rounded-xl px-4 py-4 text-lg font-semibold text-[#202020] shadow-sm"
            onClick={handleOrders}
            aria-label={t('welcome.view_your_orders')}
            aria-expanded={expanded}
            aria-controls="welcome-menu-content"
          >
            <span className="flex items-center gap-3"><ListIcon />{t('welcome.view_your_orders')}</span>
            <ArrowRightIcon />
          </button>
          <button
            className="flex items-center justify-between w-full bg-white rounded-xl px-4 py-4 text-lg font-semibold text-[#202020] shadow-sm"
            onClick={handleLoyalty}
            aria-label={t('welcome.check_loyalty_points')}
            aria-expanded={expanded}
            aria-controls="welcome-menu-content"
          >
            <span className="flex items-center gap-3"><TagIcon />{t('welcome.check_loyalty_points')}</span>
            <ArrowRightIcon />
          </button>
        </div>
        <button
          className="w-full bg-[#003D40] text-white rounded-full py-4 text-lg font-semibold mb-2 shadow"
          onClick={handleStartShopping}
          aria-label={t('common.start_shopping')}
          aria-expanded={expanded}
          aria-controls="welcome-menu-content"
        >
          {t('common.start_shopping')}
        </button>
        <button
          className="block mx-auto mt-2 text-[#202020] font-semibold flex items-center gap-1"
          onClick={() => setExpanded(false)}
          aria-expanded={expanded}
          aria-controls="welcome-menu-content"
        >
          {t('common.hide_menu')} <ChevronUpIcon />
        </button>
      </div>
    </div>
  )
} 