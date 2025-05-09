import type React from "react"
import { FilterProvider } from "@/context/filter-context"

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <FilterProvider>{children}</FilterProvider>
} 