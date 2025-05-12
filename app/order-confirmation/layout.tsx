"use client"

import React from "react"
import { FilterProvider } from "@/context/filter-context"
import { StoreProvider } from "@/context/store-context"
import { CartProvider } from "@/context/cart-context"
import { OrderProvider } from "@/context/orders-context"

export default function OrderConfirmationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <StoreProvider>
      <CartProvider>
        <OrderProvider>
          <FilterProvider>
            {children}
          </FilterProvider>
        </OrderProvider>
      </CartProvider>
    </StoreProvider>
  )
} 