import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/context/cart-context"
import { SearchProvider } from "@/context/search-context"
import { StoreProvider } from "@/context/store-context"
import { FilterProvider } from "@/context/filter-context"
import { OrderProvider } from "@/context/orders-context"
import { I18nProvider } from "@/context/i18n-context"
import { AdminPanel } from "@/components/admin-panel"
import { Suspense } from "react"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { UmamiPageView } from "@/components/analytics/umami-pageview"
import type { Metadata, Viewport } from "next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  generator: 'v0.dev',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script defer src="/_vercel/insights/script.js"></script>
        {/* Microsoft Clarity script */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/rnyldrncy4";
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "rnyldrncy4");
            `
          }}
        />
        {/* Umami analytics */}
        <script defer src="https://cloud.umami.is/script.js" data-website-id="f448018b-f910-4286-b445-b5ecac344275"></script>
      </head>
      <body className={inter.className}>
        <UmamiPageView />
        <I18nProvider>
          <StoreProvider>
            <CartProvider>
              <OrderProvider>
                <Suspense>
                  <FilterProvider>
                    <SearchProvider>
                      {children}
                    </SearchProvider>
                  </FilterProvider>
                </Suspense>
              </OrderProvider>
            </CartProvider>
          </StoreProvider>
        </I18nProvider>
        <AdminPanel />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
