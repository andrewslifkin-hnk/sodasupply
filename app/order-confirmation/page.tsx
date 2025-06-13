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

export default function OrderConfirmationPage() {
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
      return "€0.00"
    }
    try {
      return formatCurrency(amount)
    } catch (error) {
      console.error("Error formatting currency:", error)
      return "€0.00"
    }
  }

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
          <div className="flex justify-center items-center h-full">
            <p>Loading your order confirmation...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

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
          <p className="text-gray-600">The distributor will send a confirmation shortly to {phoneNumber}</p>
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
                  <div className="text-sm text-gray-600">
                    {getSafeItems().length} {getSafeItems().length === 1 ? 'item' : 'items'}
                  </div>
                </div>

                <div className="divide-y">
                  {getSafeItems().length > 0 ? (
                    getSafeItems().map((item) => (
                      <div key={item.id} className="p-4 flex items-center gap-4">
                        <div className="relative h-16 w-16 bg-gray-100 rounded">
                          <Image
                            src={item.image || "/images/no-products-found.png"}
                            alt={item.name || "Product"}
                            fill
                            className="object-contain p-2"
                            onError={(e) => {
                              console.error("Image failed to load:", item.image);
                              // Use a reliable fallback image that exists in the project
                              (e.target as HTMLImageElement).src = "/images/no-products-found.png";
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{item.name || "Product"}</div>
                          <div className="text-sm text-gray-600">{item.type || "Item"}</div>
                          <div className="text-sm text-gray-600">Quantity: {item.quantity || 1}</div>
                        </div>
                        <div className="font-bold">
                          {safeFormatCurrency(
                            (typeof item.price === 'number' ? item.price : 0) * 
                            (item.quantity || 1)
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <p>Order processed. Your cart has been cleared.</p>
                    </div>
                  )}
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
                  <span className="font-medium">{safeFormatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">VAT 21%</span>
                  <span className="font-medium">{safeFormatCurrency(vat)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-lg border-t pt-4">
                <span>Total</span>
                <span>{safeFormatCurrency(total)}</span>
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
