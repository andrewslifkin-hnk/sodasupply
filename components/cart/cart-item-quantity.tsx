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
    <div className="flex items-center border rounded-full">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={() => updateQuantity(item.id, item.quantity - 1)}
        disabled={item.quantity <= 1}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={() => updateQuantity(item.id, item.quantity + 1)}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  )
}
