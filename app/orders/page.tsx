"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useOrders, type Order } from "@/context/orders-context"
import { formatCurrency } from "@/lib/i18n-utils"
import { Filter, ShoppingCart } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useI18n } from "@/context/i18n-context"

export default function OrdersPage() {
  const router = useRouter()
  const { orders: contextOrders, getAllOrders, isLoading: ordersLoading } = useOrders()
  const { addToCart } = useCart()
  const { t, locale } = useI18n()
  
  // State for local data handling
  const [localOrders, setLocalOrders] = useState<Order[]>(contextOrders || [])
  const [isLoading, setIsLoading] = useState(true)
  
  // Initialize data on component mount
  useEffect(() => {
    const initializeOrders = async () => {
      try {
        setIsLoading(true)
        const fetchedOrders = await getAllOrders()
        if (fetchedOrders && fetchedOrders.length > 0) {
          setLocalOrders(fetchedOrders)
        }
      } catch (error) {
        console.error("Error loading orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeOrders()
  }, [getAllOrders])

  // Update local state when context orders change
  useEffect(() => {
    if (contextOrders) {
      setLocalOrders(contextOrders)
    }
  }, [contextOrders])
  
  // Safely group orders by month with defensive programming
  const groupedOrders = (localOrders || []).reduce<Record<string, Order[]>>((acc, order) => {
    if (!order || !order.orderDate) return acc;
    
    try {
      // Safely extract date parts - handle different formats
      const dateParts = order.orderDate.split(' ');
      if (dateParts.length < 2) return acc;
      
      // Extract date components
      const day = parseInt(dateParts[0]);
      const month = dateParts[1];
      const year = parseInt(dateParts[2] || new Date().getFullYear().toString());
      
      if (isNaN(day) || isNaN(year)) return acc;
      
      // Create Date object - note: month names need to be converted to month index
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthIndex = monthNames.findIndex(m => m === month);
      
      if (monthIndex !== -1) {
        const date = new Date(year, monthIndex, day);
        // Verify we have a valid date before continuing
        if (isNaN(date.getTime())) return acc;
        
        const monthKey = date.toLocaleString('en-US', { month: 'long' });
        
        if (!acc[monthKey]) {
          acc[monthKey] = [];
        }
        
        acc[monthKey].push(order);
      }
    } catch (error) {
      console.error(`Error processing order date: ${order.orderDate}`, error);
    }
    return acc;
  }, {});
  
  // Sort months - check if grouped orders exists first
  const sortedMonths = Object.keys(groupedOrders).sort((a, b) => {
    const monthOrder = [
      "January", "February", "March", "April", 
      "May", "June", "July", "August", 
      "September", "October", "November", "December"
    ];
    
    const currentMonth = new Date().getMonth();
    const monthA = monthOrder.indexOf(a);
    const monthB = monthOrder.indexOf(b);
    
    // Handle invalid months
    if (monthA === -1 || monthB === -1) return 0;
    
    // Calculate relative positions considering current month as the pivot
    const relativeA = (monthA - currentMonth + 12) % 12;
    const relativeB = (monthB - currentMonth + 12) % 12;
    
    return relativeA - relativeB;
  });
  
  // Safely sort orders within each month by date (most recent first)
  Object.keys(groupedOrders).forEach(month => {
    if (!groupedOrders[month]) return;
    
    groupedOrders[month].sort((a, b) => {
      try {
        if (!a.orderDate || !b.orderDate) return 0;
        
        const dateA = new Date(a.orderDate).getTime();
        const dateB = new Date(b.orderDate).getTime();
        
        // Check if we have valid timestamps
        if (isNaN(dateA) || isNaN(dateB)) return 0;
        
        return dateB - dateA; // Most recent first
      } catch {
        return 0;
      }
    });
  });
  
  // Function to add items to cart (from a specific order)
  const handleAddToCart = (orderId: string) => {
    const order = localOrders.find(o => o && o.id === orderId);
    if (!order || !order.items || !Array.isArray(order.items)) {
      console.error('No valid order or items found');
      return;
    }
    
    // Add each item from the order to the cart
    order.items.forEach(item => {
      if (item && typeof item.id === 'number') {
        addToCart({
          id: item.id,
          name: item.name || 'Unknown Product',
          price: typeof item.price === 'number' ? item.price : 0,
          image: item.image || '/images/no-products-found.png',
          type: item.type || 'Unknown Type',
          size: '',
        });
      }
    });
    
    // Notify user and redirect to cart
    alert("Items added to your cart!");
    router.push("/");
  };
  
  // Helper function to safely check if an order has valid items
  const hasValidItems = (order: Order) => {
    return order && 
           order.items && 
           Array.isArray(order.items) && 
           order.items.length > 0 &&
           order.items.some(item => item && typeof item.id === 'number');
  };
  
  // Handle reorder - add all items from an order back to cart
  const handleReorder = (order: Order) => {
    if (order.items && order.items.length > 0) {
      order.items.forEach(item => {
        // Convert order item to cart item format
        const cartItem = {
          id: item.id || Math.random(), // fallback ID if id not available
          name: item.name,
          price: item.price,
          image: item.image || "/images/placeholder.svg",
          type: item.type || "Product",
          size: "Standard" // Default size since not available in OrderItem
        }
        
        // Add each item with its quantity
        for (let i = 0; i < item.quantity; i++) {
          addToCart(cartItem)
        }
      })
      
      // Navigate to cart or products page
      router.push("/")
    }
  }

  // Helper function to get order status styling
  const getOrderStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Helper function to get translated status
  const getTranslatedStatus = (status: string) => {
    const statusKey = status.toLowerCase() as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    return t(`orders.status.${statusKey}`)
  }

  // Helper function to format order date
  const formatOrderDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  // Show a skeleton loading state
  const renderOrderSkeleton = () => (
    <div className="animate-pulse">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  )

  // Helper function to navigate to order details
  const handleViewOrder = (orderId: string) => {
    router.push(`/orders/${orderId}`)
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4 md:px-8">
        <div className="w-full max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{t('orders.my_orders')}</h1>
            
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>{t('common.all_filters')}</span>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <p>{t('orders.loading_orders')}</p>
            </div>
          ) : localOrders && localOrders.length > 0 ? (
            <div className="space-y-8">
              {sortedMonths.map((month) => (
                <div key={month}>
                  <h2 className="text-lg font-medium mb-4">{month}</h2>
                  
                  <div className="space-y-4">
                    {groupedOrders[month]?.map((order) => (
                      <div key={order.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        {/* Order status badge */}
                        <div className="p-4 border-b border-gray-100">
                          <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            order.status === 'processing' 
                              ? 'bg-green-100 text-green-800' 
                              : order.status === 'delivered'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Unknown'}
                          </div>
                        </div>
                        
                        {/* Order info */}
                        <div className="p-4">
                          <div className="mb-3">
                            <div className="font-medium">{order.orderNumber || 'Order'}</div>
                            <div className="text-sm text-gray-500">Order placed: {order.orderDate || 'Unknown date'}</div>
                            <div className="text-sm text-gray-500">Total: {typeof order.total === 'number' ? formatCurrency(order.total, locale) : formatCurrency(0, locale)}</div>
                          </div>
                          
                          {/* Order items preview */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {hasValidItems(order) ? (
                              order.items.slice(0, 4).map((item, index) => (
                                <div key={`${order.id}-${item.id}-${index}`} className="relative h-16 w-16 bg-gray-100 rounded">
                                  {item && item.quantity > 0 && (
                                    <div className="absolute top-0 right-0 bg-gray-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                      {item.quantity}
                                    </div>
                                  )}
                                  <Image 
                                    src={item?.image || "/images/no-products-found.png"} 
                                    alt={item?.name || 'Product'}
                                    width={64}
                                    height={64}
                                    className="object-contain p-2 h-full w-full"
                                    onError={(e) => {
                                      console.error(`Image failed to load: ${item?.image}`);
                                      // Use a reliable fallback image that exists in the project
                                      (e.target as HTMLImageElement).src = "/images/no-products-found.png";
                                    }}
                                  />
                                </div>
                              ))
                            ) : (
                              <div className="text-sm text-gray-500">No items available</div>
                            )}
                            
                            {hasValidItems(order) && order.items.length > 4 && (
                              <div className="relative h-16 w-16 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500 font-medium">
                                +{order.items.length - 4}
                              </div>
                            )}
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center gap-3">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex items-center gap-1" 
                              onClick={() => handleAddToCart(order.id)}
                              disabled={!hasValidItems(order)}
                            >
                              <ShoppingCart className="h-3.5 w-3.5" />
                              <span>Add items to cart</span>
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => router.push(`/orders/${order.id}`)}
                            >
                              View order
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-medium mb-4">No orders yet</h2>
                <div className="text-center py-8">
                  <div className="mb-4">
                    <Image 
                      src="/images/no-products-found.png" 
                      alt="No orders" 
                      width={160}
                      height={160}
                      className="mx-auto"
                    />
                  </div>
                  <p className="text-gray-500 text-sm mb-5">Ready to place your first order?</p>
                  <Button 
                    onClick={() => router.push('/')} 
                    className="bg-black hover:bg-black/90 text-white"
                  >
                    Shop now
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 