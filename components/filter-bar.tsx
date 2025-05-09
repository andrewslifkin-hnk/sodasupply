"use client"

import { Button } from "@/components/ui/button"
import { SlidersHorizontal, ChevronDown } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"

export function FilterBar() {
  const [sortOption, setSortOption] = useState("featured")

  return (
    <div className="flex items-center justify-between">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 text-[#202020]">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Sort & filter</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh] sm:h-[60vh] rounded-t-xl">
          <SheetHeader>
            <SheetTitle>Sort & Filter</SheetTitle>
            <SheetDescription>Customize your product view</SheetDescription>
          </SheetHeader>

          <div className="grid gap-6 py-6 overflow-y-auto max-h-[calc(80vh-10rem)] sm:max-h-[calc(60vh-10rem)]">
            <div>
              <h3 className="font-medium mb-3">Sort by</h3>
              <RadioGroup value={sortOption} onValueChange={setSortOption}>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="featured" id="featured" />
                  <Label htmlFor="featured">Featured</Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="price-low" id="price-low" />
                  <Label htmlFor="price-low">Price: Low to High</Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="price-high" id="price-high" />
                  <Label htmlFor="price-high">Price: High to Low</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="newest" id="newest" />
                  <Label htmlFor="newest">Newest</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <h3 className="font-medium mb-3">Category</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="running" />
                  <Label htmlFor="running">Running</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="casual" />
                  <Label htmlFor="casual">Casual</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="basketball" />
                  <Label htmlFor="basketball">Basketball</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="lifestyle" />
                  <Label htmlFor="lifestyle">Lifestyle</Label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Size</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="us8" />
                  <Label htmlFor="us8">US 8</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="us9" />
                  <Label htmlFor="us9">US 9</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="us10" />
                  <Label htmlFor="us10">US 10</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="us11" />
                  <Label htmlFor="us11">US 11</Label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Availability</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="in-stock" />
                  <Label htmlFor="in-stock">In Stock</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="out-of-stock" />
                  <Label htmlFor="out-of-stock">Out of Stock</Label>
                </div>
              </div>
            </div>
          </div>

          <SheetFooter className="flex-row gap-3 sm:justify-between">
            <Button variant="outline" className="flex-1">
              Reset
            </Button>
            <SheetClose asChild>
              <Button className="flex-1 bg-black hover:bg-black/90">Apply</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
