"use client"

import { useState } from "react"
import { useCart } from "@/context/cart-context"
import { useStore } from "@/context/store-context"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { MapPin, Truck, CreditCard, ArrowLeft, Recycle, Tag, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { PromoCodeSheet } from "@/components/checkout/promo-code-sheet"
import { DeliveryDateSheet } from "@/components/checkout/delivery-date-sheet"
import { useMediaQuery } from "@/hooks/use-media-query"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { createOrder } from "@/services/order-service"

export default function CheckoutPage() {
  const { items, totalItems } = useCart()
  const { selectedStore } = useStore()
  const [remarks, setRemarks] = useState("")
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // State for promo code
  const [isPromoSheetOpen, setIsPromoSheetOpen] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [isPromoInputVisible, setIsPromoInputVisible] = useState(false)

  // State for delivery date
  const [isDateSheetOpen, setIsDateSheetOpen] = useState(false)
  const [selectedDateId, setSelectedDateId] = useState("date-0")

  // Generate a formatted date string based on the selected date ID
  const getFormattedDate = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const today = new Date()
    const dayOffset = Number.parseInt(selectedDateId.split("-")[1]) + 1
    const date = new Date(today)
    date.setDate(today.getDate() + dayOffset)

    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`
  }

  // Get delivery date as ISO string
  const getDeliveryDateISO = () => {
    const today = new Date()
    const dayOffset = Number.parseInt(selectedDateId.split("-")[1]) + 1
    const date = new Date(today)
    date.setDate(today.getDate() + dayOffset)
    return date.toISOString()
  }

  // Calculate order totals
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const vat = subtotal * 0.21 // 21% VAT
  const delivery = 0 // Free delivery
  const total = subtotal + vat - discount

  // Handle promo code application
  const handleApplyPromo = (code: string) => {
    setPromoCode(code)
    // Mock discount calculation - in a real app, this would validate the code with an API
    if (code.toUpperCase() === "WELCOME10") {
      setDiscount(10)
    } else if (code.toUpperCase() === "SUMMER20") {
      setDiscount(20)
    } else {
      // Invalid code
      setDiscount(0)
    }
  }

  // Handle inline promo code application
  const handleInlineApplyPromo = () => {
    handleApplyPromo(promoCode)
  }

  // Toggle promo code input visibility on desktop
  const togglePromoInput = () => {
    if (isMobile) {
      setIsPromoSheetOpen(true)
    } else {
      setIsPromoInputVisible(!isPromoInputVisible)
    }
  }

  // Handle place order
  const handlePlaceOrder = async () => {
    if (!selectedStore) return

    try {
      setIsSubmitting(true)

      // Generate a random order number
      const orderNumber = `SO${Date.now().toString().slice(-8)}`

      const order = {
        store_id: Number.parseInt(selectedStore.id),
        order_number: orderNumber,
        order_date: new Date().toISOString(),
        delivery_date: getDeliveryDateISO(),
        subtotal,
        vat,
        discount,
        total,
        status: "pending",
        payment_method: "cash_on_delivery",
        remarks: remarks || undefined,
      }

      const result = await createOrder(order, items)

      if (result.success) {
        router.push("/order-confirmation")
      } else {
        console.error("Failed to create order:", result.error)
        alert("There was an error placing your order. Please try again.")
      }
    } catch (error) {
      console.error("Error placing order:", error)
      alert("There was an error placing your order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (totalItems === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-500 mb-6">Add some products to your cart before checking out</p>
          <Button onClick={() => router.push("/")}>Continue shopping</Button>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

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
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm text-gray-600"
                  onClick={() => setIsDateSheetOpen(true)}
                >
                  Change
                </Button>
              </div>
              <div className="border rounded-lg p-4">
                <div className="font-medium">{getFormattedDate()}</div>
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
                <div className="font-medium">Beverage Direct</div>
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

              {/* Promo code section */}
              <div className="mb-4">
                {!isMobile && isPromoInputVisible ? (
                  <div className="space-y-2">
                    <label htmlFor="desktop-promo-code" className="text-sm font-medium">
                      Promo code
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="desktop-promo-code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter promo code"
                        className="flex-1"
                      />
                      <Button onClick={handleInlineApplyPromo} className="bg-black hover:bg-black/90 text-white">
                        Apply
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    onClick={togglePromoInput}
                  >
                    <Tag className="h-4 w-4" />
                    {promoCode && !isMobile ? `${promoCode} applied` : "Add a promo code"}
                  </button>
                )}
              </div>

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
                {discount > 0 && (
                  <div className="flex justify-between text-purple-600">
                    <span>Discounts</span>
                    <span>− {formatCurrency(discount)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between font-bold text-lg border-t pt-4 mb-6">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>

              <Button
                className="w-full bg-black hover:bg-black/90 text-white"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Place order"
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Promo Code Sheet */}
      {isMobile && (
        <PromoCodeSheet
          isOpen={isPromoSheetOpen}
          onClose={() => setIsPromoSheetOpen(false)}
          onApply={handleApplyPromo}
        />
      )}

      {/* Delivery Date Sheet */}
      <DeliveryDateSheet
        isOpen={isDateSheetOpen}
        onClose={() => setIsDateSheetOpen(false)}
        onSave={setSelectedDateId}
        selectedDateId={selectedDateId}
      />

      <Footer />
    </div>
  )
}
