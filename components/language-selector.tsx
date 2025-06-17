"use client"

import React, { useState, useEffect } from 'react'
import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useI18n, SUPPORTED_LOCALES, type SupportedLocale, DEFAULT_LOCALE } from '@/context/i18n-context'

export function LanguageSelector() {
  const { locale, setLocale, t } = useI18n()
  const [isHydrated, setIsHydrated] = useState(false)

  // Ensure hydration safety by only showing client-specific content after hydration
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const handleLanguageChange = (newLocale: SupportedLocale) => {
    setLocale(newLocale)
  }

  // Use the actual locale only after hydration, otherwise use default
  const displayLocale = isHydrated ? locale : DEFAULT_LOCALE

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white hover:bg-white/10 transition-colors h-auto p-2 gap-2"
        >
          <Globe className="h-4 w-4" />
          <span className="text-sm">{SUPPORTED_LOCALES[displayLocale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="min-w-[200px] bg-white border border-gray-200 shadow-lg"
      >
        {Object.entries(SUPPORTED_LOCALES).map(([localeCode, localeName]) => (
          <DropdownMenuItem
            key={localeCode}
            onClick={() => handleLanguageChange(localeCode as SupportedLocale)}
            className={`cursor-pointer px-3 py-2 text-sm hover:bg-gray-50 ${
              displayLocale === localeCode 
                ? 'bg-gray-100 text-gray-900 font-medium' 
                : 'text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {localeCode === 'en' ? '🇺🇸' : '🇧🇷'}
              </span>
              <span>{localeName}</span>
              {displayLocale === localeCode && isHydrated && (
                <span className="ml-auto text-xs text-gray-500">
                  {t('common.current')}
                </span>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 