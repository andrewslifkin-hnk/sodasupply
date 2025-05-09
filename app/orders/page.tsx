"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function OrdersPage() {
  const router = useRouter()
  const [hasOrders, setHasOrders] = useState(false)
  
  // In a real app, you would fetch orders from an API
  // For now, we'll keep it as empty state
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 max-w-site py-8">
        <div className="content-container">
          <h1 className="page-title">My Orders</h1>
          
          {hasOrders ? (
            <div className="grid gap-4">
              {/* Order history would appear here */}
              <p>Your order history will appear here.</p>
            </div>
          ) : (
            <div className="card-container flex flex-col items-center justify-center text-center">
              <div className="relative w-40 h-40 mb-4">
                <Image 
                  src="/images/no-products-found.png" 
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