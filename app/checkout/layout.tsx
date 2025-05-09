"use client"

import React from "react"
import { FilterProvider } from "@/context/filter-context"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <FilterProvider>
      {children}
    </FilterProvider>
  )
} 