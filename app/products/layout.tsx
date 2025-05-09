import type React from "react"
import { FilterProvider } from "@/context/filter-context"

export default function ProductsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <FilterProvider>{children}</FilterProvider>
} 