"use client"

import { X } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useMediaQuery } from "@/hooks/use-media-query"

interface RewardItem {
  id: number
  name: string
  points: number
}

interface RewardConfirmationSheetProps {
  isOpen: boolean
  onClose: () => void
  item: RewardItem | null
  onBackToClub: () => void
}

export function RewardConfirmationSheet({ isOpen, onClose, item, onBackToClub }: RewardConfirmationSheetProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")

  if (!item) return null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side={isMobile ? "bottom" : "right"} 
        className={isMobile ? "h-auto rounded-t-xl p-4 pb-16" : "w-[450px] p-6 pb-24 overflow-y-auto"}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Reward Confirmation</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col items-center text-center py-10">
          <h2 className="text-2xl font-bold mb-2">Well done!</h2>
          <p className="text-gray-600 mb-8">
            You successfully redeemed {item.points} points.
            <br />Your order will be processed shortly.
          </p>
          
          <div className="w-32 h-32 relative mb-8">
            <Image 
              src="/images/success-icon.svg"
              alt="Success"
              fill
              priority
            />
          </div>
          
          <div className="w-full sticky bottom-0 pt-4 bg-white mb-4">
            <div className="mb-2">
              <Button 
                className="w-full bg-black hover:bg-gray-800 text-white rounded-full py-6"
                onClick={onBackToClub}
              >
                Back to SupplyClub
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 