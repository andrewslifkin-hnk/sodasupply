"use client"

import { Check, MapPin, X } from "lucide-react"
import { useStore } from "@/context/store-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { useStoreSelector } from "@/hooks/use-url-parameters"

export function StoreSheet() {
  const { stores, isStoreSheetOpen, closeStoreSheet, selectStore } = useStore()
  const isStoreVisible = useStoreSelector()

  // Don't render if disabled via URL parameter
  if (!isStoreVisible) return null

  return (
    <Sheet open={isStoreSheetOpen} onOpenChange={closeStoreSheet}>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-xl">
        <SheetHeader className="flex flex-row items-center justify-between mb-4">
          <SheetTitle>Select a Store</SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </SheetClose>
        </SheetHeader>

        <div className="space-y-4 overflow-y-auto max-h-[calc(80vh-10rem)]">
          {stores.map((store) => (
            <button
              key={store.id}
              className={`w-full p-4 text-left rounded-lg transition-colors ${
                store.isSelected ? "bg-green-50" : "hover:bg-gray-50"
              }`}
              onClick={() => selectStore(store.id)}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${store.isSelected ? "bg-green-100" : "bg-gray-100"}`}>
                  <MapPin className={`h-5 w-5 ${store.isSelected ? "text-green-700" : "text-gray-700"}`} />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 flex items-center justify-between">
                    {store.name}
                    {store.isSelected && <Check className="h-5 w-5 text-green-600" />}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {store.address}, {store.city}, {store.region}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6">
          <Button variant="outline" className="w-full">
            Find More Stores
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
