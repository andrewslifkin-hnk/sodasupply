"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Check, MapPin, Package, ShoppingCart, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useCart } from "@/context/cart-context"
import { useStore } from "@/context/store-context"

export default function OrderConfirmationPage() {
  // Add the cart context and store context
  const { clearCart } = useCart()
  const { selectedStore } = useStore()

  const [orderNumber, setOrderNumber] = useState("CO2024-00234")
  const [orderTime, setOrderTime] = useState("3:38PM")
  const [orderDate, setOrderDate] = useState("7 Oct 2024")
  const [deliveryDate, setDeliveryDate] = useState("8 Oct 2024")
  const [editDeadline, setEditDeadline] = useState("12:30")
  const [phoneNumber, setPhoneNumber] = useState("•••••••987")

  // Clear the current store's cart when the page loads
  useEffect(() => {
    clearCart()
  }, [clearCart])

  // Generate a random order number on page load
  useEffect(() => {
    const randomNum = Math.floor(10000 + Math.random() * 90000)
    setOrderNumber(`CO2024-${randomNum}`)

    // Set current time for order placed
    const now = new Date()
    setOrderTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))

    // Set current date for order placed
    setOrderDate(now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }).replace(",", ""))

    // Set delivery date (next day)
    const tomorrow = new Date()
    tomorrow.setDate(now.getDate() + 1)
    setDeliveryDate(
      tomorrow.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }).replace(",", ""),
    )

    // Set edit deadline (2 hours from now)
    const deadline = new Date()
    deadline.setHours(deadline.getHours() + 2)
    setEditDeadline(deadline.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
  }, [])

  // Mock order data
  const orderItems = [
    {
      id: 1,
      name: "Cola Classic 24x330ml",
      type: "Bottle • Crate",
      quantity: 10,
      price: 210.0,
      image: "/cola-6pack.png",
    },
  ]

  // Calculate order totals
  const subtotal = orderItems.reduce((total, item) => total + item.price, 0)
  const vat = subtotal * 0.21 // 21% VAT
  const delivery = 0 // Free delivery
  const total = subtotal + vat

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        {/* Success message */}
        <div className="flex flex-col items-center text-center mb-8 md:mb-12">
          <div className="w-24 h-24 bg-[#E8FFCC] rounded-full flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Your order was successfully placed.</h1>
          <p className="text-gray-600">The distributor will send a confirmation shortly to {phoneNumber}.</p>
        </div>

        {/* Order status and edit sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Order status */}
          <div className="bg-[#E8FFCC]/50 p-4 md:p-6 rounded-lg">
            <div className="flex items-start gap-3 mb-3">
              <div className="bg-black p-2 rounded-full">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-medium text-lg">Order status</h2>
                <p className="text-gray-600 text-sm">Review your order and keep track of updates.</p>
              </div>
            </div>
            <Button className="bg-black hover:bg-black/90 text-white mt-2">Track order</Button>
          </div>

          {/* Missed anything */}
          <div className="bg-blue-50 p-4 md:p-6 rounded-lg">
            <div className="flex items-start gap-3 mb-3">
              <div className="bg-blue-500 p-2 rounded-full">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-medium text-lg">Missed anything?</h2>
                <p className="text-gray-600 text-sm">You can edit this order until {editDeadline}</p>
              </div>
            </div>
            <Button variant="outline" className="mt-2">
              Edit order
            </Button>
          </div>
        </div>

        {/* Order details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery address */}
            <section>
              <h2 className="text-lg font-medium mb-4">Delivery address</h2>
              <div className="border rounded-lg p-4 flex items-start gap-3">
                <div className="bg-gray-100 p-2 rounded-full">
                  <MapPin className="h-5 w-5 text-gray-700" />
                </div>
                <div>
                  <div className="font-medium">{selectedStore?.name || "Cafe Scully"}</div>
                  <div className="text-sm text-gray-600">
                    {selectedStore?.address || "122 Amstelkade"}, {selectedStore?.city || "Amsterdam"},{" "}
                    {selectedStore?.region || "1019 NP"}
                  </div>
                </div>
              </div>
            </section>

            {/* Delivery details */}
            <section>
              <h2 className="text-lg font-medium mb-4">Delivery details</h2>
              <div className="border rounded-lg p-4">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500">Order number</div>
                    <div className="font-medium">{orderNumber}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Order placed</div>
                    <div className="font-medium">
                      {orderDate}, {orderTime}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Delivered date</div>
                    <div className="font-medium">{deliveryDate}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Payment method</div>
                    <div className="font-medium">Payment on delivery</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Products */}
            <section>
              <h2 className="text-lg font-medium mb-4">Products</h2>
              <div className="border rounded-lg overflow-hidden">
                <div className="p-4 border-b">
                  <div className="text-sm text-gray-600">{orderItems.length} items</div>
                </div>

                <div className="divide-y">
                  {orderItems.map((item) => (
                    <div key={item.id} className="p-4 flex items-center gap-4">
                      <div className="relative h-16 w-16 bg-gray-100 rounded">
                        <Image
                          src={item.image || "/placeholder.svg?height=64&width=64&query=soda crate"}
                          alt={item.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-600">{item.type}</div>
                        <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                      </div>
                      <div className="font-bold">{formatCurrency(item.price)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-lg font-medium mb-4">Summary</h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">VAT 21%</span>
                  <span className="font-medium">{formatCurrency(vat)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-lg border-t pt-4">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Need help */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-gray-200 p-2 rounded-full">
                  <HelpCircle className="h-5 w-5 text-gray-700" />
                </div>
                <div>
                  <h2 className="font-medium text-lg">Need help?</h2>
                  <p className="text-gray-600 text-sm">Find answers and contact details on our support page.</p>
                </div>
              </div>
              <Button className="bg-black hover:bg-black/90 text-white mt-2 w-full">Get support</Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
