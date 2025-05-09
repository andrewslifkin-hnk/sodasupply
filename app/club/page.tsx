"use client"

import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import Image from "next/image"

export default function ClubPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 max-w-site py-8">
        <div className="content-container">
          <h1 className="page-title">SodaSupply Club</h1>
          
          <div className="card-container text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-[#004851] rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            
            <h2 className="text-xl font-medium mb-3">Exclusive Member Benefits</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Join our membership program to get exclusive discounts, early access to new products, and free shipping on all orders.
            </p>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="font-medium mb-2">10% Off Every Order</h3>
                <p className="text-sm text-gray-500">Members receive an automatic 10% discount on all purchases.</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="font-medium mb-2">Free Shipping</h3>
                <p className="text-sm text-gray-500">Enjoy free shipping on all orders, no minimum purchase required.</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="font-medium mb-2">Early Access</h3>
                <p className="text-sm text-gray-500">Be the first to shop new products before they're available to the public.</p>
              </div>
            </div>
            
            <Button className="mt-8 btn-primary">
              Join Now
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 