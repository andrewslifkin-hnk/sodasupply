"use client"

import React from "react"
import { FilterProvider } from "@/context/filter-context"
import { StoreProvider } from "@/context/store-context"
import { CartProvider } from "@/context/cart-context"

export default function OrderConfirmationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <StoreProvider>
      <CartProvider>
        <FilterProvider>
          {children}
        </FilterProvider>
      </CartProvider>
    </StoreProvider>
  )
} 