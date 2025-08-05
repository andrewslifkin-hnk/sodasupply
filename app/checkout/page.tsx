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
import { useOrders } from "@/context/orders-context"
import { useTranslation } from "@/hooks/use-translation"
import { useDistributorFeatureFlag } from "@/hooks/use-distributor-feature-flag"

export default function CheckoutPage() {
  const { t } = useTranslation()
  const { items, totalItems, clearCart } = useCart()
  const { selectedStore } = useStore()
  const { getNextOrderNumber } = useOrders()
  const [remarks, setRemarks] = useState("")
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isDistributorVisible = useDistributorFeatureFlag()

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

      // Prepare order data for navigation
      // We'll move to order-confirmation page which will save the order in the orders context
      router.push("/order-confirmation")
    } catch (error) {
      console.error("Error placing order:", error)
      alert(t("common.order_error"))
      setIsSubmitting(false)
    }
  }

  if (totalItems === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">{t("cart.empty_title")}</h1>
          <p className="text-gray-500 mb-6">{t("cart.empty_description")}</p>
          <Button onClick={() => router.push("/")}>{t("cart.continue_shopping")}</Button>
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
          {t("common.back_to_shopping")}
        </Link>

        <h1 className="text-2xl font-bold mb-6">{t("navigation.checkout")}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Address */}
            <section>
              <h2 className="text-lg font-medium mb-4">{t("orders.delivery_address")}</h2>
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
                <h2 className="text-lg font-medium">{t("checkout.preferred_delivery_date")}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm text-gray-600"
                  onClick={() => setIsDateSheetOpen(true)}
                >
                  {t("common.change")}
                </Button>
              </div>
              <div className="border rounded-lg p-4">
                <div className="font-medium">{getFormattedDate()}</div>
                <div className="text-sm text-gray-600">{t("checkout.earliest_delivery")}</div>
              </div>
            </section>

            {/* Distributor */}
            {isDistributorVisible && (
              <section>
                <h2 className="text-lg font-medium mb-4">{t("products.distributor")}</h2>
                <div className="border rounded-lg p-4 flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <Truck className="h-5 w-5 text-gray-700" />
                  </div>
                  <div className="font-medium">Beverage Direct</div>
                </div>
              </section>
            )}

            {/* Payment Details */}
            <section>
              <h2 className="text-lg font-medium mb-4">{t("checkout.payment_details")}</h2>
              <div className="border rounded-lg p-4 flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <CreditCard className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <div className="font-medium">{t("checkout.payment_on_delivery")}</div>
                  <div className="text-sm text-gray-600">{t("checkout.pay_driver_in_cash")}</div>
                </div>
              </div>
            </section>

            {/* Order Remarks */}
            <section>
              <h2 className="text-lg font-medium mb-4">{t("checkout.order_remarks")}</h2>
              <Textarea
                placeholder={t("checkout.add_notes_for_distributor")}
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
                  <div className="font-medium">{t("checkout.return_empties")}</div>
                  <div className="text-sm text-gray-600">{t("checkout.driver_will_collect")}</div>
                </div>
              </div>
            </section>

            {/* Products */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">{t("navigation.products")}</h2>
                <Button variant="ghost" size="sm" className="text-sm text-gray-600">
                  {t("common.edit")}
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="p-4 border-b">
                  <div className="text-sm text-gray-600">{t("cart.item_count", { count: totalItems })}</div>
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
            <div className="bg-white border rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-medium mb-6">{t("checkout.order_summary")}</h2>

              {isMobile ? (
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm gap-2">
                    <Tag className="h-4 w-4" />
                    <span>{t("checkout.promo_code")}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setIsPromoSheetOpen(true)}>
                    {promoCode || t("common.add")}
                  </Button>
                </div>
              ) : (
                <div className="mb-4">
                  <Button variant="ghost" size="sm" className="w-full justify-start px-0" onClick={togglePromoInput}>
                    <div className="flex items-center text-sm gap-2">
                      <Tag className="h-4 w-4" />
                      <span>{t("checkout.promo_code")}</span>
                    </div>
                  </Button>
                  {isPromoInputVisible && (
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder={t("checkout.promo_code")}
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                      <Button onClick={handleInlineApplyPromo}>{t("common.apply")}</Button>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>{t("cart.subtotal")}</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("checkout.vat_details")}</span>
                  <span>{formatCurrency(vat)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("cart.delivery")}</span>
                  <span className="font-medium text-green-600">{t("cart.free")}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span>{t("checkout.discount")}</span>
                    <span className="font-medium text-red-600">-{formatCurrency(discount)}</span>
                  </div>
                )}
              </div>

              <div className="border-t my-4"></div>

              <div className="flex justify-between font-bold text-lg">
                <span>{t("cart.total")}</span>
                <span>{formatCurrency(total)}</span>
              </div>

              <Button
                size="lg"
                className="w-full mt-6"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                aria-label={t("checkout.place_order")}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  t("checkout.place_order")
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <PromoCodeSheet
        isOpen={isPromoSheetOpen}
        onClose={() => setIsPromoSheetOpen(false)}
        onApply={handleApplyPromo}
      />

      <DeliveryDateSheet
        isOpen={isDateSheetOpen}
        onClose={() => setIsDateSheetOpen(false)}
        onSave={setSelectedDateId}
        selectedDateId={selectedDateId}
      />
    </div>
  )
}
