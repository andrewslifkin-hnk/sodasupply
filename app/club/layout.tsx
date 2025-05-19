import type React from "react"
import { FilterProvider } from "@/context/filter-context"
import { StoreProvider } from "@/context/store-context"

export default function ClubLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <StoreProvider>
      <FilterProvider>
        {children}
      </FilterProvider>
    </StoreProvider>
  )
} 