import type { SupportedLocale } from '@/context/i18n-context'

/**
 * Utility functions for internationalization
 */

/**
 * Currency conversion rates (in a real app, these would come from an API)
 * Base currency is EUR
 */
const CURRENCY_RATES = {
  EUR: 1,      // Base currency
  BRL: 6.25,   // 1 EUR = 6.25 BRL (approximate rate)
}

/**
 * Get currency code based on locale
 */
export function getCurrency(locale: SupportedLocale): 'EUR' | 'BRL' {
  return locale === 'pt-BR' ? 'BRL' : 'EUR'
}

/**
 * Convert amount from EUR to target currency
 */
export function convertCurrency(amountInEUR: number, targetCurrency: 'EUR' | 'BRL'): number {
  return amountInEUR * CURRENCY_RATES[targetCurrency]
}

/**
 * Get plural suffix based on count and locale
 */
export function getPluralSuffix(count: number, locale: SupportedLocale): string {
  if (locale === 'pt-BR') {
    return count === 1 ? '' : 's'
  }
  // Default English pluralization
  return count === 1 ? '' : 's'
}

/**
 * Format currency based on locale with proper currency conversion
 */
export function formatCurrency(amount: number, locale: SupportedLocale): string {
  const currency = getCurrency(locale)
  const convertedAmount = convertCurrency(amount, currency)
  
  const formatter = new Intl.NumberFormat(locale === 'pt-BR' ? 'pt-BR' : 'en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  })
  
  return formatter.format(convertedAmount)
}

/**
 * Get currency symbol for locale
 */
export function getCurrencySymbol(locale: SupportedLocale): string {
  return locale === 'pt-BR' ? 'R$' : '€'
}

/**
 * Format date based on locale
 */
export function formatDate(date: Date | string, locale: SupportedLocale): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const formatter = new Intl.DateTimeFormat(locale === 'pt-BR' ? 'pt-BR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  
  return formatter.format(dateObj)
}

/**
 * Format short date based on locale
 */
export function formatShortDate(date: Date | string, locale: SupportedLocale): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const formatter = new Intl.DateTimeFormat(locale === 'pt-BR' ? 'pt-BR' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  
  return formatter.format(dateObj)
}

/**
 * Format number based on locale
 */
export function formatNumber(number: number, locale: SupportedLocale): string {
  const formatter = new Intl.NumberFormat(locale === 'pt-BR' ? 'pt-BR' : 'en-US')
  return formatter.format(number)
}

/**
 * Get RTL/LTR direction for locale
 */
export function getTextDirection(locale: SupportedLocale): 'ltr' | 'rtl' {
  // All current supported locales are LTR
  return 'ltr'
}

/**
 * Helper to get browser language preference
 */
export function getBrowserLocale(): SupportedLocale {
  if (typeof window === 'undefined') return 'en'
  
  const browserLang = navigator.language || 'en'
  
  if (browserLang.startsWith('pt')) {
    return 'pt-BR'
  }
  
  return 'en'
}

/**
 * Helper to validate if a locale is supported
 */
export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return locale === 'en' || locale === 'pt-BR'
}

// Helper function to normalize size for translation key
export const normalizeSize = (size: string): string => {
  // Handle Portuguese sizes that might come from the database
  if (size.includes('ml') || size.includes('Litros')) {
    return size.toLowerCase().replace(/\s+/g, '_');
  }
  
  // Extract the base size (e.g., "12 fl oz" from "12 fl oz 12 Pack Cans")
  const baseSize = size.match(/([\d.]+ fl oz|[\d.]+ Liters?|[\d.]+ ml|[\d.]+ Litros?)/i)?.[0] || size
  
  // Extract the package info
  const packageMatch = size.match(/(\d+)\s*(Pack|Count|Bottles?|Cans?|Garrafas?|Latas?|Unidades?)/i)
  const packageInfo = packageMatch 
    ? `${packageMatch[1]}_${packageMatch[2].toLowerCase().replace(/s$/, '').replace(/garrafas?/i, 'bottle').replace(/latas?/i, 'can').replace(/unidades?/i, 'count')}`
    : ''

  // Clean and normalize the base size
  const normalizedBase = baseSize.toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/litros?/gi, 'liters')
    .replace(/garrafa/gi, 'bottle')

  // Combine for translation key
  const key = packageInfo 
    ? `${normalizedBase}_${packageInfo}`
    : normalizedBase

  // Further normalize the key
  return key.replace(/\s+/g, '_')
    .replace(/-/g, '_')
    .replace(/\./g, '_')
    .toLowerCase()
} 