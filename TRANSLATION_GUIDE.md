# Translation System Guide

This guide explains how to use and extend the internationalization (i18n) system in SodaSupply.

## Overview

The translation system is built with:
- **React Context** for state management
- **React Intl** for advanced i18n features
- **JSON files** for translation storage
- **TypeScript** for type safety
- **LocalStorage** for persistence

## Current Supported Languages

- **English (en)** - Default language
- **Brazilian Portuguese (pt-BR)** - First additional language

## File Structure

```
├── context/
│   └── i18n-context.tsx          # Main i18n context and provider
├── components/
│   └── language-selector.tsx     # Language selector component
├── locales/
│   ├── en.json                   # English translations
│   └── pt-BR.json               # Brazilian Portuguese translations
├── hooks/
│   └── use-translation.ts        # Translation hook
├── lib/
│   └── i18n-utils.ts            # Utility functions
└── types/
    └── i18n.ts                  # TypeScript definitions
```

## Using Translations in Components

### Basic Usage

```tsx
import { useI18n } from '@/context/i18n-context'

export function MyComponent() {
  const { t } = useI18n()
  
  return (
    <div>
      <h1>{t('footer.company_name')}</h1>
      <p>{t('footer.company_description')}</p>
    </div>
  )
}
```

### Alternative Hook

```tsx
import { useTranslation } from '@/hooks/use-translation'

export function MyComponent() {
  const { t, locale } = useTranslation()
  
  return <h1>{t('common.loading')}</h1>
}
```

### With Variables

```tsx
const { t } = useI18n()

// For key: "redeem_points": "Redeem {points} points"
const message = t('club.redeem_points', { points: 100 })
// Result: "Redeem 100 points"
```

### Using Utilities

```tsx
import { formatCurrency, formatDate } from '@/lib/i18n-utils'
import { useI18n } from '@/context/i18n-context'

export function PriceDisplay({ amount, date }) {
  const { locale } = useI18n()
  
  return (
    <div>
      <span>{formatCurrency(amount, locale)}</span>
      <span>{formatDate(date, locale)}</span>
    </div>
  )
}
```

## Adding New Translations

### 1. Add to Translation Files

Add the new key to both `locales/en.json` and `locales/pt-BR.json`:

**English (en.json):**
```json
{
  "products": {
    "add_to_wishlist": "Add to Wishlist"
  }
}
```

**Portuguese (pt-BR.json):**
```json
{
  "products": {
    "add_to_wishlist": "Adicionar aos Favoritos"
  }
}
```

### 2. Update TypeScript Types

Add the new key to `types/i18n.ts`:

```typescript
export interface TranslationKeys {
  products: {
    add_to_wishlist: string
    // ... other keys
  }
}
```

### 3. Use in Components

```tsx
const { t } = useI18n()
return <button>{t('products.add_to_wishlist')}</button>
```

## Adding a New Language

### 1. Update Supported Locales

In `context/i18n-context.tsx`:

```typescript
export const SUPPORTED_LOCALES = {
  en: 'English',
  'pt-BR': 'Português (Brasil)',
  'es': 'Español',  // Add new language
} as const
```

### 2. Create Translation File

Create `locales/es.json` with all required translations:

```json
{
  "footer": {
    "company_name": "SodaSupply",
    "company_description": "Tu tienda completa para bebidas premium y más...",
    // ... all other translations
  }
}
```

### 3. Update Language Selector

In `components/language-selector.tsx`, add the flag and logic:

```tsx
<span className="text-lg">
  {localeCode === 'en' ? '🇺🇸' : 
   localeCode === 'pt-BR' ? '🇧🇷' : 
   localeCode === 'es' ? '🇪🇸' : '🌐'}
</span>
```

### 4. Update Utilities

Update `lib/i18n-utils.ts` for locale-specific formatting:

```typescript
export function formatCurrency(amount: number, locale: SupportedLocale): string {
  const localeMap = {
    'en': 'en-US',
    'pt-BR': 'pt-BR',
    'es': 'es-ES'
  }
  
  const formatter = new Intl.NumberFormat(localeMap[locale], {
    style: 'currency',
    currency: 'EUR',
  })
  
  return formatter.format(amount)
}
```

## Language Detection & Persistence

The system automatically:
1. **Checks localStorage** for saved preference
2. **Detects browser language** if no preference saved
3. **Falls back to English** if language not supported
4. **Saves changes** to localStorage when user switches

## Best Practices

### Translation Keys

- Use **dot notation** for nested keys: `footer.company_name`
- Use **descriptive names**: `account.need_help_description`
- Group by **feature area**: `cart.*, orders.*, products.*`

### Variable Interpolation

```json
{
  "messages": {
    "welcome": "Welcome, {name}!",
    "items_count": "You have {count} item{plural} in your cart"
  }
}
```

```tsx
t('messages.welcome', { name: 'Andrew' })
t('messages.items_count', { count: 3, plural: 's' })
```

### Pluralization

Handle plurals properly for each language:

```json
// English
"view_filtered_products": "View {count} filtered product{plural}"

// Portuguese (more complex pluralization)
"view_filtered_products": "Ver {count} produto{plural} filtrado{plural}"
```

### Conditional Content

For language-specific content:

```tsx
const { locale } = useI18n()

return (
  <div>
    {locale === 'pt-BR' ? (
      <p>Conteúdo específico para o Brasil</p>
    ) : (
      <p>Default English content</p>
    )}
  </div>
)
```

## Language Selector Component

The language selector is automatically included in the footer and provides:
- **Current language display**
- **Dropdown with all supported languages**
- **Flag icons** for visual identification
- **Persistent selection** via localStorage

## Utilities Available

- `formatCurrency(amount, locale)` - Format currency by locale
- `formatDate(date, locale)` - Format dates by locale
- `formatShortDate(date, locale)` - Format short dates
- `formatNumber(number, locale)` - Format numbers
- `getPluralSuffix(count, locale)` - Get plural suffix
- `getBrowserLocale()` - Detect browser language
- `isSupportedLocale(locale)` - Validate locale support

## Error Handling

The system gracefully handles:
- **Missing translation keys** - Returns the key itself
- **Failed locale loading** - Falls back to English
- **Invalid locales** - Uses default language
- **Browser compatibility** - Works without localStorage

## Performance

- **Lazy loading** - Translation files loaded on demand
- **Caching** - Messages cached in memory
- **Small bundles** - Only active language loaded
- **Fast switching** - Instant language changes

## Future Extensions

Easy to add:
- **More languages** - Just add locale files
- **Region variants** - `en-US`, `en-GB`, etc.
- **RTL languages** - Arabic, Hebrew support
- **Advanced pluralization** - ICU message format
- **Date/time formatting** - Locale-specific formats

## Git Commit Message

```
feat: implement comprehensive translation system with Portuguese support

- Add React Context-based i18n system with localStorage persistence
- Create English and Brazilian Portuguese translation files
- Implement language selector component in footer
- Add TypeScript definitions for type-safe translations
- Include utility functions for locale-specific formatting
- Support automatic browser language detection
- Enable easy addition of new languages and translations
``` 