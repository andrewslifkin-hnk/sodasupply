import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/context/cart-context"
import { SearchProvider } from "@/context/search-context"
import { StoreProvider } from "@/context/store-context"
import { FilterProvider } from "@/context/filter-context"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <CartProvider>
            <Suspense>
              <FilterProvider>
                <SearchProvider>{children}</SearchProvider>
              </FilterProvider>
            </Suspense>
          </CartProvider>
        </StoreProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
