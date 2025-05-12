"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useOrders, type Order } from "@/context/orders-context"
import { formatCurrency } from "@/lib/utils"
import { Filter, ShoppingCart } from "lucide-react"

export default function OrdersPage() {
  const router = useRouter()
  const { orders } = useOrders()
  
  // Group orders by month
  const groupedOrders = orders.reduce<Record<string, Order[]>>((acc, order) => {
    const date = new Date(order.orderDate.split(' ').slice(0, 3).join(' '));
    const month = date.toLocaleString('en-US', { month: 'long' });
    
    if (!acc[month]) {
      acc[month] = [];
    }
    
    acc[month].push(order);
    return acc;
  }, {});
  
  // Function to add items to cart (you would implement this in your cart context)
  const handleAddToCart = (orderId: string) => {
    // TODO: Implement adding items from an order to the cart
    console.log("Adding items from order to cart:", orderId);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 max-w-site py-8">
        <div className="content-container">
          <div className="flex justify-between items-center mb-6">
            <h1 className="page-title mb-0">My Orders</h1>
            
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>All filters</span>
            </Button>
          </div>
          
          {orders.length > 0 ? (
            <div className="space-y-8">
              {Object.entries(groupedOrders).map(([month, monthOrders]) => (
                <div key={month}>
                  <h2 className="text-lg font-medium mb-4">{month}</h2>
                  
                  <div className="space-y-4">
                    {monthOrders.map((order) => (
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
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </div>
                        </div>
                        
                        {/* Order info */}
                        <div className="p-4">
                          <div className="mb-3">
                            <div className="font-medium">{order.orderNumber}</div>
                            <div className="text-sm text-gray-500">Order placed: {order.orderDate}</div>
                            <div className="text-sm text-gray-500">Total: {formatCurrency(order.total)}</div>
                          </div>
                          
                          {/* Order items preview */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {order.items.map((item) => (
                              <div key={item.id} className="relative h-16 w-16 bg-gray-100 rounded">
                                <div className="absolute top-0 right-0 bg-gray-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{item.quantity}</div>
                                <Image 
                                  src={item.image || "/placeholder.svg"} 
                                  alt={item.name}
                                  fill
                                  className="object-contain p-2"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center gap-3">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex items-center gap-1" 
                              onClick={() => handleAddToCart(order.id)}
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
            <div className="card-container flex flex-col items-center justify-center text-center">
              <div className="relative w-40 h-40 mb-4">
                <Image 
                  src="/empty-orders.svg" 
                  alt="No orders" 
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              
              <h2 className="text-lg font-medium mb-1">No orders yet</h2>
              <p className="text-gray-500 text-sm mb-5">Ready to place your first order?</p>
              
              <Button 
                onClick={() => router.push('/')} 
                className="btn-primary"
              >
                Shop now
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 