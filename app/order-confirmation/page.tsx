"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Check, MapPin, Package, ShoppingCart, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useCart } from "@/context/cart-context"
import { useStore } from "@/context/store-context"
import { useOrders } from "@/context/orders-context"
import { useTranslation } from "@/hooks/use-translation"

export default function OrderConfirmationPage() {
  const { t } = useTranslation()
  // Add the cart context and store context
  const { clearCart, items } = useCart()
  const { selectedStore } = useStore()
  const { saveOrder, getNextOrderNumber } = useOrders()

  // Add a loading state to prevent hydration mismatch
  const [isLoading, setIsLoading] = useState(true)
  const [orderNumber, setOrderNumber] = useState<string>("")
  const [orderTime, setOrderTime] = useState<string>("")
  const [orderDate, setOrderDate] = useState<string>("")
  const [deliveryDate, setDeliveryDate] = useState<string>("")
  const [editDeadline, setEditDeadline] = useState<string>("")
  const [phoneNumber, setPhoneNumber] = useState<string>("•••••••987")
  
  // Store cart items before clearing - helps avoid race conditions
  const [savedCartItems, setSavedCartItems] = useState<typeof items>([])
  
  // Add a ref to track if cart has been cleared
  const hasCartBeenCleared = useRef(false)
  // Add a ref to track if order has been saved
  const hasOrderBeenSaved = useRef(false)
  
  // Create a ref to hold the order number so it doesn't change between renders
  const orderNumberRef = useRef<string>("")

  // First, capture cart items and generate order data on first render
  useEffect(() => {
    const setupOrder = async () => {
      try {
        // Ensure we only run this once
        if (orderNumberRef.current) {
          console.log("Order already initialized with number:", orderNumberRef.current);
          setOrderNumber(orderNumberRef.current);
          setIsLoading(false);
          return;
        }
        
        // Capture cart items at the initial render before any changes
        if (items.length > 0 && savedCartItems.length === 0) {
          console.log("Saving cart items:", items.length);
          setSavedCartItems([...items]);
        }
        
        // Generate order data only once and store it in the ref
        orderNumberRef.current = getNextOrderNumber();
        setOrderNumber(orderNumberRef.current);
        console.log("Generated order number:", orderNumberRef.current);
        
        // Set current time for order placed
        const now = new Date();
        setOrderTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));

        // Set current date for order placed - format as "DD MMM YYYY"
        setOrderDate(now.toLocaleDateString("en-GB", { 
          day: "numeric", 
          month: "short", 
          year: "numeric" 
        }).replace(",", ""));

        // Set delivery date (next day) - format as "DD MMM YYYY"
        const tomorrow = new Date();
        tomorrow.setDate(now.getDate() + 1);
        setDeliveryDate(
          tomorrow.toLocaleDateString("en-GB", { 
            day: "numeric", 
            month: "short", 
            year: "numeric" 
          }).replace(",", "")
        );

        // Set edit deadline (2 hours from now)
        const deadline = new Date();
        deadline.setHours(deadline.getHours() + 2);
        setEditDeadline(deadline.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error setting up order:", error);
        setIsLoading(false);
      }
    };
    
    setupOrder();
  }, [items, getNextOrderNumber, savedCartItems.length]);

  // Save the order once we have all data ready
  useEffect(() => {
    const saveOrderData = async () => {
      // Only proceed if we have items to save and haven't saved yet and we have a valid order number
      if (!isLoading && 
          !hasOrderBeenSaved.current && 
          orderNumberRef.current && // Use the ref to ensure consistency
          savedCartItems.length > 0) {
        try {
          console.log("Saving order with items:", savedCartItems.length);
          
          // Prepare the order data
          const orderData = {
            orderNumber: orderNumberRef.current, // Always use the ref value
            orderDate,
            orderTime,
            deliveryDate,
            items: savedCartItems.map(item => ({
              id: item.id,
              name: item.name || "Unknown Product",
              type: item.type || "Unknown Type",
              quantity: item.quantity || 1,
              price: typeof item.price === 'number' ? item.price : 0,
              image: item.image || "/images/no-products-found.png"
            })),
            total: savedCartItems.reduce((total, item) => 
              total + ((typeof item.price === 'number' ? item.price : 0) * (item.quantity || 1)), 0),
            status: "processing" as "processing" | "delivered" | "cancelled",
            storeId: selectedStore?.id,
            storeName: selectedStore?.name
          };
          
          try {
            // Try to save to database
            await saveOrder(orderData);
            console.log("Order saved successfully to database");
          } catch (dbError) {
            // If database save fails, save to localStorage as fallback
            console.error("Error saving to database, using localStorage fallback:", dbError);
            
            // Save to localStorage as fallback
            try {
              // Get existing orders
              const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
              
              // Generate a truly unique ID with more entropy
              const timestamp = Date.now();
              const randomValue = Math.floor(Math.random() * 10000);
              const uniqueId = `local-${timestamp}-${randomValue}`;
              
              // Create the new order with the unique ID
              const newOrder = {
                ...orderData,
                id: uniqueId,
                createdAt: new Date().toISOString()
              };
              
              // Add to local orders and save back to localStorage
              localOrders.unshift(newOrder);
              localStorage.setItem('orders', JSON.stringify(localOrders));
              console.log("Order saved to localStorage with ID:", uniqueId);
            } catch (localStorageError) {
              console.error("Error saving to localStorage:", localStorageError);
            }
          }
          
          // Mark that we've saved the order (whether to DB or localStorage)
          hasOrderBeenSaved.current = true;
          
          // Clear the cart AFTER saving the order
          if (!hasCartBeenCleared.current) {
            console.log("Clearing cart after saving order");
            clearCart();
            hasCartBeenCleared.current = true;
          }
        } catch (error) {
          console.error("Error in order saving process:", error);
          
          // Even if there's an error in the overall process, still clear the cart
          // to prevent duplicate order submissions
          if (!hasCartBeenCleared.current) {
            console.log("Clearing cart after error to prevent duplicate submissions");
            clearCart();
            hasCartBeenCleared.current = true;
          }
        }
      }
    };
    
    saveOrderData();
  }, [isLoading, orderDate, orderTime, deliveryDate, savedCartItems, selectedStore, saveOrder, clearCart]);

  // Track conversion event with Umami after order is saved and not loading
  useEffect(() => {
    if (!isLoading && orderNumber && savedCartItems.length > 0 && typeof window !== 'undefined' && window.umami) {
      window.umami.track('conversion', {
        order_number: orderNumber,
        total: savedCartItems.reduce((total, item) => total + ((typeof item.price === 'number' ? item.price : 0) * (item.quantity || 1)), 0),
        items_count: savedCartItems.length,
        store_id: selectedStore?.id,
        store_name: selectedStore?.name,
      })
    }
  }, [isLoading, orderNumber, savedCartItems, selectedStore])

  // Helper function to safely render items when they might be empty
  const getSafeItems = () => {
    return savedCartItems && savedCartItems.length > 0 ? savedCartItems : [];
  }

  // Calculate order totals from actual cart items, with safety checks
  const subtotal = getSafeItems().reduce((total, item) => 
    total + ((typeof item.price === 'number' ? item.price : 0) * (item.quantity || 1)), 0)
  const vat = subtotal * 0.21 // 21% VAT
  const delivery = 0 // Free delivery
  const total = subtotal + vat

  // Determine if we're still loading or waiting for essential data
  const isPageLoading = isLoading || !orderNumber || !orderDate || !deliveryDate;

  // Safe formatCurrency function that handles edge cases
  const safeFormatCurrency = (amount: number | undefined | null) => {
    if (amount === undefined || amount === null) {
      return t("common.currency_symbol") + "0.00"
    }
    try {
      return formatCurrency(amount)
    } catch (error) {
      console.error("Error formatting currency:", error)
      return t("common.currency_symbol") + "0.00"
    }
  }

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
          <div className="flex justify-center items-center h-full">
            <p>{t("orders.loading_confirmation")}</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Top Section */}
          <div className="text-center mb-8">
            <div className="inline-block bg-green-100 p-4 rounded-full mb-4">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{t("orders.order_confirmed")}</h1>
            <p className="text-gray-600 text-lg">{t("orders.order_placed_successfully")}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-center">
            <Button>{t("orders.track_order")}</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Order Details */}
              <div className="border rounded-lg p-6">
                <h2 className="text-xl font-medium mb-4">{t("orders.order_details")}</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("orders.order_no")}</span>
                    <span className="font-medium">#{orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("orders.placed_at")}</span>
                    <span className="font-medium">
                      {orderTime} {t("common.on")} {orderDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="border rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-medium">{t("orders.delivery_address")}</h2>
                  <Button variant="ghost" size="sm" className="text-sm">
                    {t("common.change")}
                  </Button>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-gray-100 p-3 rounded-full mt-1">
                    <MapPin className="h-5 w-5 text-gray-700" />
                  </div>
                  <div>
                    <div className="font-medium">{selectedStore?.name}</div>
                    <div className="text-sm text-gray-600">
                      {selectedStore?.address}, {selectedStore?.city}
                    </div>
                  </div>
                </div>
                <div className="border-t my-4"></div>
                <div className="flex items-start gap-4">
                  <div className="bg-gray-100 p-3 rounded-full mt-1">
                    <Package className="h-5 w-5 text-gray-700" />
                  </div>
                  <div>
                    <div className="font-medium">{t("orders.delivery_date_label")}</div>
                    <div className="text-sm text-gray-600">{deliveryDate}</div>
                    <p className="text-xs text-gray-500 mt-2">
                      {t("orders.driver_will_call")} {phoneNumber} {t("orders.to_confirm_delivery")}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{t("orders.edit_order_until")} {editDeadline}</p>
                  </div>
                </div>
              </div>

              {/* What happens next */}
              <div className="border rounded-lg p-6">
                <h2 className="text-xl font-medium mb-4">{t("orders.what_happens_next")}</h2>
                <ul className="space-y-4 text-sm text-gray-600">
                  <li className="flex gap-4">
                    <div className="bg-gray-100 p-2 rounded-full h-fit">
                      <Check className="h-4 w-4 text-gray-600" />
                    </div>
                    <span>{t("orders.email_confirmation_message")}</span>
                  </li>
                  <li className="flex gap-4">
                    <div className="bg-gray-100 p-2 rounded-full h-fit">
                      <Check className="h-4 w-4 text-gray-600" />
                    </div>
                    <span>{t("orders.distributor_prepares_order")}</span>
                  </li>
                  <li className="flex gap-4">
                    <div className="bg-gray-100 p-2 rounded-full h-fit">
                      <Check className="h-4 w-4 text-gray-600" />
                    </div>
                    <span>{t("orders.track_on_my_orders")}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column (Order Summary) */}
            <div className="border rounded-lg p-6 h-fit sticky top-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">{t("checkout.order_summary")}</h2>
                <div className="bg-gray-100 p-2 rounded-full">
                  <ShoppingCart className="h-5 w-5 text-gray-700" />
                </div>
              </div>
              <div className="space-y-4">
                {getSafeItems().map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={item.image || "/images/no-products-found.png"}
                        alt={item.name || "Product image"}
                        fill
                        className="object-contain p-1"
                      />
                      <div className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm truncate">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.type}</div>
                    </div>
                    <div className="font-medium text-sm">{safeFormatCurrency(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>

              <div className="border-t my-6"></div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("cart.subtotal")}</span>
                  <span className="font-medium">{safeFormatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("checkout.vat_details")}</span>
                  <span className="font-medium">{safeFormatCurrency(vat)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("orders.delivery_fee")}</span>
                  <span className="font-medium text-green-600">{t("cart.free")}</span>
                </div>
              </div>

              <div className="border-t my-4"></div>

              <div className="flex justify-between font-bold text-lg">
                <span>{t("cart.total")}</span>
                <span>{safeFormatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Bottom section */}
          <div className="mt-12 text-center">
            <div className="border rounded-lg p-6 inline-flex items-center gap-4">
              <HelpCircle className="h-6 w-6 text-gray-500" />
              <div>
                <h3 className="font-medium">{t("account.need_help")}</h3>
                <p className="text-sm text-gray-600">{t("orders.help_center_contact")}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Button onClick={() => (window.location.href = "/")} size="lg">
              {t("cart.continue_shopping")}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
