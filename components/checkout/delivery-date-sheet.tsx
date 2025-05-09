"use client"

import { useState } from "react"
import { X, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useMediaQuery } from "@/hooks/use-media-query"

interface DeliveryDate {
  id: string
  day: string
  date: string
  month: string
  isEarliest?: boolean
  isLast?: boolean
}

interface DeliveryDateSheetProps {
  isOpen: boolean
  onClose: () => void
  onSave: (dateId: string) => void
  selectedDateId: string
}

export function DeliveryDateSheet({ isOpen, onClose, onSave, selectedDateId }: DeliveryDateSheetProps) {
  const [selectedDate, setSelectedDate] = useState(selectedDateId)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Generate delivery dates for the next 5 days
  const generateDeliveryDates = (): DeliveryDate[] => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const dates: DeliveryDate[] = []
    const today = new Date()

    for (let i = 0; i < 5; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i + 1) // Start from tomorrow

      dates.push({
        id: `date-${i}`,
        day: days[date.getDay()],
        date: date.getDate().toString(),
        month: months[date.getMonth()],
        isEarliest: i === 0,
        isLast: i === 4,
      })
    }

    return dates
  }

  const deliveryDates = generateDeliveryDates()

  const handleSave = () => {
    onSave(selectedDate)
    onClose()
  }

  // Content to be used in both mobile and desktop versions
  const content = (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-500 mt-0.5" />
        <p className="text-gray-700">Your delivery date may be changed by the distributor during order processing.</p>
      </div>

      <RadioGroup value={selectedDate} onValueChange={setSelectedDate}>
        {deliveryDates.map((date) => (
          <div key={date.id} className={`border-b last:border-b-0 ${selectedDate === date.id ? "bg-green-50" : ""}`}>
            <div className="flex items-center space-x-2 p-4">
              <RadioGroupItem
                value={date.id}
                id={date.id}
                className={selectedDate === date.id ? "text-green-600" : ""}
              />
              <div className="flex-1">
                <Label htmlFor={date.id} className="flex flex-col">
                  <span className="font-medium">
                    {date.day}, {date.date} {date.month}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {date.isEarliest
                      ? "Earliest option available. Free of charge."
                      : date.isLast
                        ? "Last option available. Free of charge."
                        : "Free of charge"}
                  </span>
                </Label>
              </div>
            </div>
          </div>
        ))}
      </RadioGroup>

      <div className="space-y-3">
        <Button onClick={handleSave} className="w-full bg-black hover:bg-black/90 text-white">
          Save
        </Button>
        <Button onClick={onClose} variant="outline" className="w-full">
          Cancel
        </Button>
      </div>
    </div>
  )

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side={isMobile ? "bottom" : "right"} className={isMobile ? "h-auto rounded-t-xl" : "w-[400px]"}>
        <SheetHeader className="flex flex-row items-center justify-between mb-4">
          <SheetTitle>Delivery date</SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </SheetClose>
        </SheetHeader>
        {content}
      </SheetContent>
    </Sheet>
  )
}
