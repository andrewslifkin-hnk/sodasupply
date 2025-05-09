"use client"

import { Trash2, ShoppingBag } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useStore } from "@/context/store-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useMediaQuery } from "@/hooks/use-media-query"
import Image from "next/image"
import { CartItemQuantity } from "./cart-item-quantity"
import { formatCurrency } from "@/lib/utils"
import { useRouter } from "next/navigation"

export function CartSheet({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { items, removeFromCart, totalItems } = useCart()
  const { selectedStore } = useStore()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const router = useRouter()

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const vat = subtotal * 0.21 // 21% VAT
  const total = subtotal + vat

  const handleCheckout = () => {
    onClose()
    router.push("/checkout")
  }

  const handleContinueShopping = () => {
    onClose()
    router.push("/")
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side={isMobile ? "bottom" : "right"} className={isMobile ? "h-[90vh] rounded-t-xl" : "w-[400px]"}>
        <SheetHeader className="flex flex-row items-center justify-between mb-4">
          <SheetTitle>Cart</SheetTitle>
        </SheetHeader>

        {selectedStore && (
          <div className="flex items-center gap-3 mb-4 pb-4 border-b">
            <div className="bg-gray-100 p-2 rounded-full">
              <ShoppingBag className="h-5 w-5 text-gray-700" />
            </div>
            <div>
              <div className="font-medium">{selectedStore.name}</div>
              <div className="text-sm text-gray-500">
                {selectedStore.address}, {selectedStore.city}
              </div>
            </div>
          </div>
        )}

        {totalItems > 0 ? (
          <div className="text-sm text-gray-500 mb-4">
            {totalItems} {totalItems === 1 ? "product" : "products"}
          </div>
        ) : (
          <div className="text-center py-8">
            <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-medium mb-1">Your cart is empty</h3>
            <p className="text-gray-500 mb-4">Add some products to your cart</p>
            <Button onClick={handleContinueShopping}>Continue shopping</Button>
          </div>
        )}

        {totalItems > 0 && (
          <>
            <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-20rem)]">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 pb-4 border-b">
                  <div className="relative h-20 w-20 bg-gray-100 rounded">
                    <Image
                      src={item.image || `/placeholder.svg?height=80&width=80&query=${encodeURIComponent(item.name)}`}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{item.name}</h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-red-500"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      {item.type} · {item.size}
                    </div>
                    <div className="flex items-center justify-between">
                      <CartItemQuantity item={item} />
                      <div className="font-bold">{formatCurrency(item.price * item.quantity)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Button variant="outline" className="w-full mb-6" onClick={handleContinueShopping}>
                Continue shopping
              </Button>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">VAT</span>
                  <span className="font-medium">{formatCurrency(vat)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-lg border-t pt-4 mb-6">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>

              <Button className="w-full bg-black hover:bg-black/90" onClick={handleCheckout}>
                Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
