"use client"

import { X, MapPin } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetClose, SheetTitle } from "@/components/ui/sheet"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useStore } from "@/context/store-context"

interface RewardItem {
  id: number
  name: string
  points: number
  image: string
  category: string
}

interface RewardSummarySheetProps {
  isOpen: boolean
  onClose: () => void
  item: RewardItem | null
  onRedeem: () => void
  onCancel: () => void
}

export function RewardSummarySheet({ isOpen, onClose, item, onRedeem, onCancel }: RewardSummarySheetProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { selectedStore } = useStore()

  if (!item) return null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side={isMobile ? "bottom" : "right"} 
        className={isMobile ? "h-auto rounded-t-xl p-4 pb-16" : "w-[450px] p-6 pb-24 overflow-y-auto"}
      >
        <SheetHeader className="flex flex-row items-center justify-between mb-6">
          <SheetTitle className="text-xl font-bold">Reward</SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-5 w-5" />
            </Button>
          </SheetClose>
        </SheetHeader>

        <div className="flex flex-col">
          {/* Item summary */}
          <div className="border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-gray-50 p-2 rounded-md w-12 h-12 flex items-center justify-center">
                <div className="relative w-8 h-8">
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
              <div className="flex-1">
                <h3 className="font-medium text-sm">{item.name}</h3>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-gray-500">Quantity: 1</p>
                  <p className="text-sm font-semibold">{item.points} points</p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery details */}
          <h3 className="text-lg font-semibold mb-4">Delivers to</h3>
          <div className="border border-gray-200 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-black w-10 h-10 rounded-full flex items-center justify-center">
                <MapPin className="text-white h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium">{selectedStore?.name || "Selected Store"}</h4>
                <p className="text-sm text-gray-500">
                  {selectedStore?.address || "123 Main St"}, {selectedStore?.city || "City"}, {selectedStore?.region || "Region"}
                </p>
              </div>
            </div>
          </div>

          {/* Standardized sticky footer */}
          <div className="sticky bottom-0 pt-4 bg-white mb-4">
            <div className="mb-2">
              <Button 
                className="bg-black hover:bg-gray-800 text-white rounded-full py-6 mb-3 w-full"
                onClick={onRedeem}
              >
                Redeem {item.points} points
              </Button>
              
              <Button 
                variant="outline" 
                className="rounded-full py-6 border-gray-300 w-full"
                onClick={onCancel}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 