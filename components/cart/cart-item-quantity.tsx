"use client"

import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import type { CartItem } from "@/context/cart-context"

interface CartItemQuantityProps {
  item: CartItem
}

export function CartItemQuantity({ item }: CartItemQuantityProps) {
  const { updateQuantity } = useCart()

  return (
    <div 
      className="flex items-center border rounded-full"
      role="group"
      aria-label={`Quantity selector for ${item.name}`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:bg-gray-50 disabled:text-gray-400"
        onClick={() => updateQuantity(item.id, item.quantity - 1)}
        disabled={item.quantity <= 1}
        aria-label={`Decrease quantity of ${item.name}`}
        tabIndex={0}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span 
        className="w-8 text-center font-medium text-sm text-gray-900"
        role="status"
        aria-live="polite"
        aria-label={`Current quantity: ${item.quantity}`}
      >
        {item.quantity}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        onClick={() => updateQuantity(item.id, item.quantity + 1)}
        aria-label={`Increase quantity of ${item.name}`}
        tabIndex={0}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  )
}
