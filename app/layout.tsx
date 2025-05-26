import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/context/cart-context"
import { SearchProvider } from "@/context/search-context"
import { StoreProvider } from "@/context/store-context"
import { FilterProvider } from "@/context/filter-context"
import { OrderProvider } from "@/context/orders-context"
import { Suspense, useEffect } from "react"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import ClarityInit from '@/components/ClarityInit'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  generator: 'v0.dev',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script defer src="/_vercel/insights/script.js"></script>
      </head>
      <body className={inter.className}>
        <ClarityInit />
        <StoreProvider>
          <CartProvider>
            <OrderProvider>
              <Suspense>
                <FilterProvider>
                  <SearchProvider>{children}</SearchProvider>
                </FilterProvider>
              </Suspense>
            </OrderProvider>
          </CartProvider>
        </StoreProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
