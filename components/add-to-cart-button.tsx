"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Plus, Minus } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useCart } from "@/context/cart-context"

interface Product {
  id: number
  name: string
  type: string
  size: string
  price: number
  image: string
  inStock: boolean
}

interface AddToCartButtonProps {
  product: Product
  className?: string
}

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const { getItemQuantity, updateQuantity, addToCart } = useCart()
  const quantity = getItemQuantity(product.id)

  const incrementQuantity = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!product.inStock) return
    if (quantity === 0) {
      addToCart(product)
    } else {
      updateQuantity(product.id, quantity + 1)
    }
  }

  const decrementQuantity = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (quantity <= 0) return
    updateQuantity(product.id, quantity - 1)
  }

  // Always show the stepper by default
  return (
    <motion.div
      initial={{ width: 120 }}
      animate={{ width: 120 }}
      className={cn(
        "flex items-center justify-between bg-white rounded-full shadow-lg z-10 h-10 border-2 border-gray-300",
        className,
      )}
      role="group"
      aria-label={`Quantity selector for ${product.name}`}
    >
      <Button
        size="icon"
        variant="ghost"
        onClick={decrementQuantity}
        className="rounded-full h-8 w-8 bg-[#1d1d1d] text-white"
        disabled={!product.inStock || quantity <= 0}
        aria-label={`Decrease quantity of ${product.name}`}
        tabIndex={0}
      >
        <Minus className="h-3 w-3" />
      </Button>

      <div 
        className="flex items-center justify-center font-medium text-sm min-w-[40px] text-white"
        role="status"
        aria-live="polite"
        aria-label={`Current quantity: ${quantity}`}
      >
        {quantity}
      </div>

      <Button
        size="icon"
        variant="ghost"
        onClick={incrementQuantity}
        data-testid="add-to-cart"
        className="rounded-full h-8 w-8 bg-[#1d1d1d] text-white"
        disabled={!product.inStock}
        aria-label={`Increase quantity of ${product.name}`}
        tabIndex={0}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </motion.div>
  )
}
