"use client"

import { useI18n } from '@/context/i18n-context'

/**
 * Simple hook for using translations in components
 * Re-exports the useI18n hook for easier imports
 */
export const useTranslation = () => {
  const { t, locale, setLocale, isLoading } = useI18n()
  
  return {
    t,
    locale,
    setLocale,
    isLoading,
  }
}

// Also export the useI18n hook for compatibility
export { useI18n } from '@/context/i18n-context' 