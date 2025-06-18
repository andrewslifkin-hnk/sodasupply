"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

// Supported languages
export const SUPPORTED_LOCALES = {
  en: 'English',
  'pt-BR': 'Português (Brasil)',
} as const

export type SupportedLocale = keyof typeof SUPPORTED_LOCALES
export const DEFAULT_LOCALE: SupportedLocale = 'en'

// Translation messages type
type Messages = Record<string, string | Record<string, string>>

interface I18nContextType {
  locale: SupportedLocale
  setLocale: (locale: SupportedLocale) => void
  t: (key: string, values?: Record<string, any>) => string
  isLoading: boolean
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

// Helper function to get user's preferred language, now checks URL param first
function getPreferredLocale(): SupportedLocale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE

  // 1. Check URL parameter
  const urlParams = new URLSearchParams(window.location.search)
  const urlLocale = urlParams.get('lang') as SupportedLocale
  if (urlLocale && urlLocale in SUPPORTED_LOCALES) {
    localStorage.setItem('preferred-locale', urlLocale)
    return urlLocale
  }

  // 2. Check localStorage
  const stored = localStorage.getItem('preferred-locale') as SupportedLocale
  if (stored && stored in SUPPORTED_LOCALES) {
    return stored
  }

  // 3. Check browser language
  const browserLang = navigator.language
  if (browserLang.startsWith('pt')) {
    return 'pt-BR'
  }

  return DEFAULT_LOCALE
}

// Dynamic message loader
async function loadMessages(locale: SupportedLocale): Promise<Messages> {
  try {
    const messages = await import(`../locales/${locale}.json`)
    return messages.default || messages
  } catch (error) {
    console.warn(`Failed to load messages for locale ${locale}, falling back to ${DEFAULT_LOCALE}`)
    if (locale !== DEFAULT_LOCALE) {
      const fallbackMessages = await import(`../locales/${DEFAULT_LOCALE}.json`)
      return fallbackMessages.default || fallbackMessages
    }
    return {}
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(DEFAULT_LOCALE)
  const [messages, setMessages] = useState<Messages>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load messages when locale changes
  useEffect(() => {
    let isMounted = true

    const loadAndSetMessages = async () => {
      setIsLoading(true)
      try {
        const newMessages = await loadMessages(locale)
        if (isMounted) {
          setMessages(newMessages)
        }
      } catch (error) {
        console.error('Error loading translation messages:', error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadAndSetMessages()

    return () => {
      isMounted = false
    }
  }, [locale])

  // Initialize locale on client-side only, after hydration
  useEffect(() => {
    setIsHydrated(true)
    const preferredLocale = getPreferredLocale()
    if (preferredLocale !== DEFAULT_LOCALE) {
      setLocaleState(preferredLocale)
    }
  }, [])

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale)
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-locale', newLocale)
    }
  }

  // Simple translation function with nested key support
  const t = (key: string, values?: Record<string, any>): string => {
    const keys = key.split('.')
    let result: any = messages

    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k]
      } else {
        // Better fallback logic for missing translations
        if (key.startsWith('product_types.') || key.startsWith('sizes.') || key.startsWith('brands.')) {
          // For product-related translations, return the last part (the actual value)
          const lastPart = keys[keys.length - 1]
          // If it's already in the target language, return as is
          if (locale === 'pt-BR' && lastPart && 
              (lastPart.includes('Bebida') || lastPart.includes('Água') || 
               lastPart.includes('Refrigerante') || lastPart.includes('Suco') ||
               lastPart.includes('ml') || lastPart.includes('Litros'))) {
            return lastPart
          }
          return lastPart || key
        }
        console.warn(`Translation key not found: ${key}`)
        return key // Return key if translation not found
      }
    }

    if (typeof result !== 'string') {
      console.warn(`Translation key "${key}" does not resolve to a string`)
      return key
    }

    // Simple variable substitution
    if (values) {
      return result.replace(/\{(\w+)\}/g, (match, varName) => {
        return values[varName]?.toString() || match
      })
    }

    return result
  }

  const contextValue: I18nContextType = {
    locale,
    setLocale,
    t,
    isLoading: isLoading || !isHydrated,
  }

  if (contextValue.isLoading) {
    return null; // Or a full-page loader
  }

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
} 