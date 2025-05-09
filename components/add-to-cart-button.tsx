"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Minus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
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
  const [expanded, setExpanded] = useState(false)
  const { getItemQuantity, updateQuantity, addToCart } = useCart()
  const quantity = getItemQuantity(product.id)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Function to start the collapse timer
  const startCollapseTimer = () => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    // Set a new timer to collapse after 3 seconds
    timerRef.current = setTimeout(() => {
      if (quantity > 0) {
        setExpanded(false)
      }
    }, 3000)
  }

  // Reset timer when quantity changes or component mounts
  useEffect(() => {
    if (expanded && quantity > 0) {
      startCollapseTimer()
    }

    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [quantity, expanded])

  const handleInitialAdd = () => {
    if (!product.inStock) return

    if (quantity === 0) {
      addToCart(product)
      setExpanded(true)
      startCollapseTimer()
    } else {
      setExpanded(true)
      startCollapseTimer()
    }
  }

  const incrementQuantity = (e: React.MouseEvent) => {
    e.stopPropagation()
    updateQuantity(product.id, quantity + 1)
    startCollapseTimer() // Reset timer on interaction
  }

  const decrementQuantity = (e: React.MouseEvent) => {
    e.stopPropagation()
    updateQuantity(product.id, quantity - 1)

    if (quantity - 1 <= 0) {
      setTimeout(() => setExpanded(false), 300)
    } else {
      startCollapseTimer() // Reset timer on interaction
    }
  }

  // Default state (just the plus button)
  if (!expanded && quantity === 0) {
    return (
      <Button
        size="icon"
        onClick={handleInitialAdd}
        disabled={!product.inStock}
        className={cn(
          "rounded-full shadow-lg z-10 transition-all duration-300",
          "bg-black hover:bg-black/90 text-white",
          !product.inStock && "opacity-50 cursor-not-allowed bg-gray-300 hover:bg-gray-300",
          className,
        )}
      >
        <Plus className="h-4 w-4" />
      </Button>
    )
  }

  // Collapsed state with quantity (just shows the number)
  if (!expanded && quantity > 0) {
    return (
      <Button
        size="icon"
        onClick={() => {
          setExpanded(true)
          startCollapseTimer()
        }}
        className={cn(
          "rounded-full shadow-lg z-10 transition-all duration-300",
          "bg-black hover:bg-black/90 text-white",
          className,
        )}
      >
        <span className="text-sm font-medium">{quantity}</span>
      </Button>
    )
  }

  // Expanded state (minus, quantity, plus)
  return (
    <motion.div
      initial={{ width: 40 }}
      animate={{ width: expanded ? 120 : 64 }}
      className={cn(
        "flex items-center justify-between bg-white rounded-full shadow-lg z-10 h-10",
        "border border-gray-200",
        className,
      )}
    >
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="overflow-hidden"
          >
            <Button
              size="icon"
              variant="ghost"
              onClick={decrementQuantity}
              className="rounded-full h-8 w-8 bg-black text-white hover:bg-black/90"
            >
              <Minus className="h-3 w-3" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="flex items-center justify-center font-medium text-sm min-w-[40px]"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
      >
        {quantity}
      </motion.div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="overflow-hidden"
          >
            <Button
              size="icon"
              variant="ghost"
              onClick={incrementQuantity}
              className="rounded-full h-8 w-8 bg-black text-white hover:bg-black/90"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
