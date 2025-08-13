"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { X, Plus, Minus } from "lucide-react"
import { useCart } from "@/context/cart-context"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useI18n } from "@/context/i18n-context"
import { formatCurrency } from "@/lib/i18n-utils"
import { cn } from "@/lib/utils"

interface CartSheetProps {
  isOpen: boolean
  onClose: () => void
  side?: "right" | "bottom"
}

export function CartSheet({ isOpen, onClose, side = "right" }: CartSheetProps) {
  const { items, updateQuantity, removeFromCart, totalItems } = useCart()
  const router = useRouter()
  const { t, locale } = useI18n()

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const vat = subtotal * 0.2 // 20% VAT
  const total = subtotal + vat

  const handleCheckout = () => {
    onClose()
    router.push("/checkout")
  }

  const handleContinueShopping = () => {
    onClose()
    router.push("/products")
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side={side}
        className={cn(
          side === "bottom" ? "h-[85vh] rounded-t-xl" : "w-full sm:max-w-lg",
          "p-0 flex flex-col"
        )}
      >
        <SheetHeader className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold">
              {t('cart.title')} ({t('cart.item_count', { 
                count: totalItems, 
                plural: totalItems === 1 ? '' : 's' 
              })})
            </SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl">🛒</div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('cart.empty_title')}</h3>
              <p className="text-gray-500">{t('cart.empty_description')}</p>
            </div>
            <Button onClick={handleContinueShopping} className="w-full">
              {t('cart.continue_shopping')}
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="relative h-16 w-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image || `/placeholder.svg?height=80&width=80&query=${encodeURIComponent(item.name)}`}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{item.type} · {item.size}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="font-bold">{formatCurrency(item.price * item.quantity, locale)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t('cart.subtotal')}</span>
                  <span className="font-medium">{formatCurrency(subtotal, locale)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{t('cart.vat')}</span>
                  <span className="font-medium">{formatCurrency(vat, locale)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{t('cart.delivery')}</span>
                  <span className="font-medium text-green-600">{t('cart.free')}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>{t('cart.total')}</span>
                    <span>{formatCurrency(total, locale)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button data-testid="checkout" onClick={handleCheckout} className="w-full">
                  {t('cart.checkout')}
                </Button>
                <Button variant="outline" onClick={handleContinueShopping} className="w-full">
                  {t('cart.continue_shopping')}
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
