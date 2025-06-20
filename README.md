# SodaSupply

A modern e-commerce platform for beverage distribution with a focus on specialty sodas, sports drinks, and enhanced waters.

## Overview

SodaSupply is a Next.js-based e-commerce platform designed specifically for beverage distribution. It features a clean, intuitive interface with product browsing, filtering, cart management, and order processing capabilities.

## Features

- **Product Catalog**: Browse a wide range of beverages organized by category
- **Search & Filtering**: Find products easily with advanced filtering options
- **Shopping Cart**: Add products to cart with quantity controls
- **Order Management**: Track order status and history
- **Responsive Design**: Optimized for mobile, tablet, and desktop views
- **Supabase Integration**: Backend powered by Supabase for data storage
- **Store Selector**: Location-based selection
- **Loyalty Club**: Program for rewarding customers
- **Multi-language Support**: English and Portuguese
- **Feature Flags**: For controlled rollouts

## Screenshots

![SodaSupply Preview](public/images/preview.png)

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **State Management**: React Context API
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS, Shadcn UI components
- **Deployment**: Vercel

## Database Setup

This project uses Supabase as its database. To set up the database:

1. Create a Supabase account at [supabase.com](https://supabase.com) if you don't have one
2. Create a new project
3. Get your project credentials from the API settings page
4. Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

5. Install dependencies if you haven't already:

```
pnpm install
```

6. Generate the SQL setup script with instructions:

```
node scripts/db/setup-database.js
```

This will:
- Display the SQL script in the terminal
- Save it to `scripts/db/database-setup.sql` for easy access
- Provide step-by-step instructions for executing it in the Supabase SQL Editor

7. Execute the script in the Supabase SQL Editor:
   - Navigate to your Supabase project dashboard
   - Go to the SQL Editor
   - Create a new query
   - Copy and paste the generated SQL script
   - Click "Run"

## Product Listing

The application uses real product images from the `/public/products` directory in the database. The products are organized by categories:

- Sports Drinks (Gatorade, POWERADE)
- Enhanced Water (Vitamin Water, Propel)
- Prebiotic Sodas (OLIPOP, Poppi)

All products are displayed on the products page with search and filtering capabilities.

## Environment Variables

The following environment variables need to be set in your `.env.local` file:

| Variable | Description |
|----------|-------------|
| NEXT_PUBLIC_SUPABASE_URL | Your Supabase project URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Your Supabase anonymous key |

## Running Locally

To run the application locally:

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

The app will be available at http://localhost:3000

## Project Structure

```
sodasupply/
├── app/               # Next.js app pages
│   ├── api/           # API routes
│   ├── products/      # Product pages
│   ├── cart/          # Cart page
│   └── orders/        # Order management
├── components/        # Reusable UI components
├── context/           # React context providers
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── public/            # Static assets
│   └── products/      # Product images
├── services/          # API service functions
├── scripts/           # Database setup scripts
│   └── db/            # Database SQL files
├── styles/            # Global styles
└── types/             # TypeScript type definitions
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## URL Parameter Controls

The application includes a centralized URL parameter management system located in `hooks/use-url-parameters.ts`. This allows you to control various features using URL parameters.

### Available Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `store_selector` | `true` | Controls the store selector in the header |
| `distributor_selector` | `true` | Controls the distributor selector on product pages |
| `promo_banner` | `true` | Controls promotional banners (future use) |
| `search_overlay` | `true` | Controls search overlay functionality (future use) |
| `admin_panel` | `false` | Shows the admin panel for managing all parameters |

### Parameter Values

You can use multiple formats to enable/disable features:

**Enable (true):** `true`, `on`, `1`, `yes`, `enabled`, or omit the parameter
**Disable (false):** `false`, `off`, `0`, `no`, `disabled`

### Usage Examples

**Single Parameters:**
- `https://yoursite.com/?store_selector=false` - Hide store selector
- `https://yoursite.com/?distributor_selector=off` - Hide distributor selector
- `https://yoursite.com/?store_selector=disabled` - Hide store selector

**Multiple Parameters:**
- `https://yoursite.com/?store_selector=false&distributor_selector=false` - Hide both selectors
- `https://yoursite.com/?store_selector=on&distributor_selector=off` - Show store, hide distributor
- `https://yoursite.com/products?distributor_selector=0&promo_banner=no` - Hide distributor and promo banner

**All Features Disabled:**
```
https://yoursite.com/?store_selector=false&distributor_selector=false&promo_banner=false&search_overlay=false
```

### Development Usage

For testing on localhost:
```bash
# Hide both selectors
http://localhost:3002/?store_selector=false&distributor_selector=false

# Hide only store selector
http://localhost:3002/?store_selector=off

# Hide only distributor selector  
http://localhost:3002/?distributor_selector=disabled

# Access admin panel
http://localhost:3002/?admin_panel=true

# Access admin panel with other parameters
http://localhost:3002/?admin_panel=true&store_selector=false
```

### Programmatic Usage

You can also control parameters programmatically in your code:

```typescript
import { useUrlParameters, updateUrlParameters } from "@/hooks/use-url-parameters"

// Get current parameter values
const params = useUrlParameters()

// Update parameters programmatically
updateUrlParameters({ 
  store_selector: false, 
  distributor_selector: true 
})
```

This system works in both development and production environments and automatically handles URL cleanup (removes parameters when they match default values).

## Getting Started
