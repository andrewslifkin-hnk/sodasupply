"use client"

import Image from "next/image"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AddToCartButton } from "./add-to-cart-button"

interface Product {
  id: number
  name: string
  type: string
  size: string
  price: number
  image: string
  returnable: boolean
  inStock: boolean
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="relative">
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          <div className="bg-gray-100 text-[#202020] text-xs font-medium px-2 py-1 rounded">{product.type}</div>
          <div className="bg-gray-100 text-[#202020] text-xs font-medium px-2 py-1 rounded">{product.size}</div>
        </div>

        <div className="relative h-48 bg-gray-50">
          <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-contain p-4" />
        </div>

        <AddToCartButton
          product={product}
          className={cn("absolute bottom-4 right-4", !product.inStock && "opacity-50 cursor-not-allowed")}
        />
      </div>

      <div className="p-4">
        {product.returnable && (
          <div className="flex items-center gap-1 text-black text-xs font-medium mb-2">
            <span className="inline-block w-3 h-3 bg-black rounded-full"></span>
            Free Returns
          </div>
        )}

        {!product.inStock && (
          <div className="flex items-center gap-1 text-red-500 text-xs font-medium mb-2">
            <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
            Out of stock
          </div>
        )}

        <h3 className="font-medium text-[#202020] mb-1 line-clamp-2">{product.name}</h3>
        <div className="text-sm text-[#202020]/70 mb-2">
          {product.type} · {product.size}
        </div>
        <div className="flex items-center justify-between">
          <div className="font-bold text-[#202020]">€ {product.price.toFixed(2)}</div>

          {!product.inStock && (
            <Button variant="outline" size="sm" className="text-xs h-8 gap-1">
              <Bell className="h-3 w-3" />
              Notify me
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
