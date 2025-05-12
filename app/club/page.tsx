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
      
      <main className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center text-center max-w-[400px]">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg>
          </div>
          
          <h2 className="text-xl font-medium mb-2">SodaSupply Club information unavailable</h2>
          <p className="text-gray-600 mb-6">
            We're having trouble loading your SodaSupply Club information right now. Please check back shortly or contact support if the issue persists.
          </p>
          
          <Link href="/">
            <Button className="bg-[#004851] text-white hover:bg-[#003840]">
              Back to homepage
            </Button>
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 