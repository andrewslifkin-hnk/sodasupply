"use client"

import { useState } from "react"
import { useCart } from "@/context/cart-context"
import { useStore } from "@/context/store-context"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Truck, CreditCard, ArrowLeft, Recycle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const { items, totalItems } = useCart()
  const { selectedStore } = useStore()
  const [remarks, setRemarks] = useState("")
  const router = useRouter()

  // Calculate order totals
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const vat = subtotal * 0.21 // 21% VAT
  const delivery = 0 // Free delivery
  const discount = 12.5 // Example discount
  const total = subtotal + vat - discount

  // Mock delivery date
  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + 2)
  const formattedDate = deliveryDate.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
  })

  if (totalItems === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="bg-black text-white py-4">
          <div className="container mx-auto px-4 flex items-center">
            <Link href="/" className="font-bold text-xl tracking-[-2px]">
              Store
            </Link>
          </div>
        </header>
        <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-500 mb-6">Add some products to your cart before checking out</p>
          <Button onClick={() => router.push("/")}>Continue shopping</Button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-black text-white py-4">
        <div className="container mx-auto px-4 flex items-center">
          <Link href="/" className="font-bold text-xl tracking-[-2px]">
            Store
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-black mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to shopping
        </Link>

        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Address */}
            <section>
              <h2 className="text-lg font-medium mb-4">Delivery address</h2>
              <div className="border rounded-lg p-4 flex items-start gap-3">
                <div className="bg-gray-100 p-2 rounded-full">
                  <MapPin className="h-5 w-5 text-gray-700" />
                </div>
                <div>
                  <div className="font-medium">{selectedStore?.name || "Store Location"}</div>
                  <div className="text-sm text-gray-600">
                    {selectedStore?.address || "123 Main St"}, {selectedStore?.city || "City"},{" "}
                    {selectedStore?.region || "Region"}
                  </div>
                </div>
              </div>
            </section>

            {/* Preferred Delivery Date */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Preferred delivery date</h2>
                <Button variant="ghost" size="sm" className="text-sm text-gray-600">
                  Change
                </Button>
              </div>
              <div className="border rounded-lg p-4">
                <div className="font-medium">{formattedDate}</div>
                <div className="text-sm text-gray-600">Earliest option available. Free of charge.</div>
              </div>
            </section>

            {/* Distributor */}
            <section>
              <h2 className="text-lg font-medium mb-4">Distributor</h2>
              <div className="border rounded-lg p-4 flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-full">
                  <Truck className="h-5 w-5 text-gray-700" />
                </div>
                <div className="font-medium">Sneaker Vault</div>
              </div>
            </section>

            {/* Payment Details */}
            <section>
              <h2 className="text-lg font-medium mb-4">Payment details</h2>
              <div className="border rounded-lg p-4 flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <CreditCard className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <div className="font-medium">Payment on delivery</div>
                  <div className="text-sm text-gray-600">Pay driver in cash</div>
                </div>
              </div>
            </section>

            {/* Order Remarks */}
            <section>
              <h2 className="text-lg font-medium mb-4">Order remarks</h2>
              <Textarea
                placeholder="Add notes for distributor"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full h-32"
              />
              <div className="flex justify-end mt-2 text-xs text-gray-500">{remarks.length} / 200</div>
            </section>

            {/* Return Empties */}
            <section className="bg-green-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Recycle className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <div className="font-medium">Return your empties</div>
                  <div className="text-sm text-gray-600">The driver will collect them.</div>
                </div>
              </div>
            </section>

            {/* Products */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Products</h2>
                <Button variant="ghost" size="sm" className="text-sm text-gray-600">
                  Edit
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="p-4 border-b">
                  <div className="text-sm text-gray-600">{totalItems} items</div>
                </div>

                <div className="divide-y">
                  {items.map((item) => (
                    <div key={item.id} className="p-4 flex items-center gap-4">
                      <div className="relative h-16 w-16 bg-gray-100 rounded">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-600">
                          {item.type} · {item.size}
                        </div>
                        <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                      </div>
                      <div className="font-bold">{formatCurrency(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border rounded-lg p-6 sticky top-8">
              <h2 className="text-lg font-medium mb-4">Summary</h2>

              <button className="text-sm text-blue-600 hover:underline mb-4 flex items-center">Add a promo code</button>

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
                <div className="flex justify-between text-purple-600">
                  <span>Discounts</span>
                  <span>− {formatCurrency(discount)}</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-lg border-t pt-4 mb-6">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>

              <Button className="w-full bg-black hover:bg-black/90">Place order</Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-black text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="font-bold text-xl tracking-[-2px]">Store</div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-white/70 hover:text-white">
                Customer Support
              </Link>
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-black text-xs">
                  E
                </div>
                <span className="text-sm">English</span>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-4">
            <div className="flex flex-col md:flex-row justify-between text-sm text-white/50">
              <div className="flex flex-wrap gap-4 mb-4 md:mb-0">
                <Link href="#" className="hover:text-white/80">
                  Privacy Policy
                </Link>
                <Link href="#" className="hover:text-white/80">
                  Terms & Conditions
                </Link>
                <Link href="#" className="hover:text-white/80">
                  Cookie Settings
                </Link>
                <Link href="#" className="hover:text-white/80">
                  Cookie Policy
                </Link>
              </div>
              <div>Heineken Company Limited ©2023 All rights reserved. Account region: The Netherlands</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
