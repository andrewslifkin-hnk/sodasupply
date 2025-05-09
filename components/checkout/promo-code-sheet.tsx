"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"

interface PromoCodeSheetProps {
  isOpen: boolean
  onClose: () => void
  onApply: (code: string) => void
}

export function PromoCodeSheet({ isOpen, onClose, onApply }: PromoCodeSheetProps) {
  const [promoCode, setPromoCode] = useState("")

  const handleApply = () => {
    if (promoCode.trim()) {
      onApply(promoCode.trim())
      onClose()
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-auto rounded-t-xl">
        <SheetHeader className="flex flex-row items-center justify-between mb-4">
          <SheetTitle>Add promo code</SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </SheetClose>
        </SheetHeader>

        <div className="space-y-6">
          <p className="text-gray-600">Enter the code without any space between letters</p>

          <div className="space-y-2">
            <label htmlFor="promo-code" className="text-sm font-medium">
              Promo code
            </label>
            <Input
              id="promo-code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter promo code"
              className="w-full"
              autoComplete="off"
            />
          </div>

          <Button onClick={handleApply} className="w-full bg-black hover:bg-black/90 text-white">
            Apply
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
