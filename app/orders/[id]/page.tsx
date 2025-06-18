"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useOrders } from "@/context/orders-context"
import { formatCurrency } from "@/lib/utils"
import { ArrowLeft, MapPin, Package, ShoppingCart } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { supabase } from "@/lib/supabase"
import { useTranslation } from "@/hooks/use-translation"

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const { t } = useTranslation()
  const router = useRouter()
  const { getOrderById, orders } = useOrders()
  const { addToCart } = useCart()
  const [order, setOrder] = useState<ReturnType<typeof getOrderById>>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  
  // Stabilize the fetch function with useCallback
  const fetchOrderDetails = useCallback(async () => {
    try {
      setIsLoading(true)
      
      // First try to get from context
      const cachedOrder = getOrderById(params.id)
      
      if (cachedOrder) {
        setOrder(cachedOrder)
        return
      }
      
      // If not in context, fetch directly from database
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', params.id)
        .single()
      
      if (error || !data) {
        console.error("Error fetching order:", error)
        router.push("/orders")
        return
      }
      
      // Transform the order to our application format
      const transformedOrder = {
        id: data.id.toString(),
        orderNumber: data.order_number,
        orderDate: new Date(data.order_date).toLocaleDateString("en-GB", { 
          day: "numeric", 
          month: "short", 
          year: "numeric" 
        }).replace(",", ""),
        orderTime: new Date(data.order_date).toLocaleTimeString([], { 
          hour: "2-digit", 
          minute: "2-digit" 
        }),
        deliveryDate: new Date(data.delivery_date).toLocaleDateString("en-GB", { 
          day: "numeric", 
          month: "short", 
          year: "numeric" 
        }).replace(",", ""),
        total: data.total,
        status: data.status,
        storeId: data.store_id?.toString(),
        storeName: data.store_name,
        storeAddress: data.store_address || "",
        items: data.order_items.map((item: any) => ({
          id: item.product_id,
          name: item.product_name,
          type: item.product_type,
          quantity: item.quantity,
          price: item.price,
          image: item.image || "/images/no-products-found.png"
        }))
      }
      
      setOrder(transformedOrder)
    } catch (error) {
      console.error("Error fetching order:", error)
      router.push("/orders")
    } finally {
      setIsLoading(false)
    }
  }, [params.id, getOrderById, router])
  
  // Fetch the order only once when component mounts
  useEffect(() => {
    fetchOrderDetails()
  }, [fetchOrderDetails]) // It's safe to include fetchOrderDetails here because it's memoized
  
  const handleAddAllToCart = () => {
    if (!order) return
    
    // Add each item to cart
    order.items.forEach(item => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image, // Use the actual image from the item
        type: item.type,
        size: "", // Add appropriate size if available
      })
    })
    
    // Show confirmation and navigate to cart
    alert("All items have been added to your cart")
    router.push("/")
  }
  
  if (isLoading || !order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
          <div className="flex justify-center items-center h-full">
            <p>{t("orders.loading_orders")}</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }
  
  // Calculate totals
  const subtotal = order.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  const vat = subtotal * 0.21 // 21% VAT
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 max-w-site py-8">
        <div className="content-container">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-gray-600 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t("orders.my_orders")}
          </button>
          
          <div className="mb-6">
            <div className={`inline-flex px-3 py-1 text-sm font-medium rounded-full mb-2 ${
              order.status === 'processing' 
                ? 'bg-green-100 text-green-800' 
                : order.status === 'delivered'
                ? 'bg-gray-100 text-gray-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {t(`orders.status.${order.status}`)}
            </div>
            <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
            <p className="text-gray-500">Ordered on {order.orderDate} at {order.orderTime}</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery address */}
              {order.storeName && (
                <section>
                  <h2 className="text-lg font-medium mb-4">{t("orders.delivery_address")}</h2>
                  <div className="bg-white border rounded-lg p-4 flex items-start gap-3">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <MapPin className="h-5 w-5 text-gray-700" />
                    </div>
                    <div>
                      <div className="font-medium">{order.storeName}</div>
                      <div className="text-sm text-gray-600">{order.storeAddress || "No address available"}</div>
                    </div>
                  </div>
                </section>
              )}
              
              {/* Order items */}
              <section>
                <h2 className="text-lg font-medium mb-4">{t("orders.order_details")}</h2>
                <div className="bg-white border rounded-lg overflow-hidden">
                  <div className="p-4 border-b">
                    <div className="text-sm text-gray-600">{t("cart.item_count", { count: order.items.length, plural: order.items.length === 1 ? "" : "s" })}</div>
                  </div>
                  
                  <div className="divide-y">
                    {order.items.map((item) => (
                      <div key={item.id} className="p-4 flex items-center gap-4">
                        <div className="relative h-16 w-16 bg-gray-100 rounded">
                          <Image
                            src={item.image || "/images/no-products-found.png"}
                            alt={item.name}
                            fill
                            className="object-contain p-2"
                            onError={(e) => {
                              console.error(`Image failed to load: ${item.image}`);
                              // Use a reliable fallback image that exists in the project
                              (e.target as HTMLImageElement).src = "/images/no-products-found.png";
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-600">{item.type}</div>
                          <div className="text-sm text-gray-600">{t("cart.quantity")}: {item.quantity}</div>
                        </div>
                        <div className="font-bold">{formatCurrency(item.price * item.quantity)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
              
              {/* Delivery details */}
              <section>
                <h2 className="text-lg font-medium mb-4">{t("orders.delivery_details")}</h2>
                <div className="bg-white border rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Order placed</div>
                      <div className="font-medium">{order.orderDate}, {order.orderTime}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{t("orders.delivery_date")}</div>
                      <div className="font-medium">{order.deliveryDate}</div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            
            <div className="lg:col-span-1 space-y-6">
              {/* Order summary */}
              <div className="bg-white border rounded-lg p-6">
                <h2 className="text-lg font-medium mb-4">{t("checkout.order_summary")}</h2>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("cart.subtotal")}</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("checkout.vat_details")}</span>
                    <span className="font-medium">{formatCurrency(vat)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("cart.delivery")}</span>
                    <span className="text-green-600">{t("cart.free")}</span>
                  </div>
                </div>
                
                <div className="flex justify-between font-bold text-lg border-t pt-4">
                  <span>{t("cart.total")}</span>
                  <span className="font-medium">{formatCurrency(order.total)}</span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="bg-white border rounded-lg p-6">
                <Button 
                  onClick={handleAddAllToCart}
                  className="w-full bg-black hover:bg-black/90 text-white"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {t("orders.reorder")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 