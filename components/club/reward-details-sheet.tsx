"use client"

import { X } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetClose, SheetTitle } from "@/components/ui/sheet"
import { useMediaQuery } from "@/hooks/use-media-query"

interface RewardItem {
  id: number
  name: string
  points: number
  image: string
  category: string
}

interface RewardDetailsSheetProps {
  isOpen: boolean
  onClose: () => void
  item: RewardItem | null
  onClaimReward: () => void
}

export function RewardDetailsSheet({ isOpen, onClose, item, onClaimReward }: RewardDetailsSheetProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")

  if (!item) return null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side={isMobile ? "bottom" : "right"} 
        className={isMobile ? "h-[90vh] rounded-t-xl p-4 pb-16" : "w-[450px] p-6 pb-24 overflow-y-auto"}
      >
        <SheetHeader className="flex flex-row items-center justify-end mb-4">
          <SheetTitle className="sr-only">Reward Details</SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-5 w-5" />
            </Button>
          </SheetClose>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <div className="bg-gray-50 rounded-lg p-4 mb-6 flex justify-center">
            <div className="w-64 h-64 relative">
              <Image 
                src={item.image} 
                alt={item.name}
                fill
                style={{ objectFit: "contain" }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/placeholder.svg";
                }}
              />
            </div>
          </div>
          
          <h2 className="text-xl font-bold mb-4">{item.name}</h2>
          
          <h3 className="text-lg font-semibold mb-2">Product details</h3>
          <p className="text-gray-600 mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          
          <div className="mt-auto sticky bottom-0 pt-4 bg-white mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-lg font-bold">{item.points} points</p>
              <Button 
                className="bg-black hover:bg-gray-800 text-white rounded-full px-6 py-6"
                onClick={onClaimReward}
              >
                Claim reward
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 