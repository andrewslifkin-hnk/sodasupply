"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"

export default function OutletsPage() {
  const router = useRouter()
  
  // Mock outlets data - in a real app, this would come from an API
  const outlets = [
    { id: 1, name: "Canal Side Cafe", address: "Amstelkade 122, 1019 NP Amsterdam" },
    { id: 2, name: "The Green Spot", address: "Prinsengracht 45, 1015 DK Amsterdam" },
    { id: 3, name: "Riverside Bar", address: "Weesperzijde 23, 1091 EC Amsterdam" },
  ]
  
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
            Back to account
          </button>
          
          <h1 className="text-2xl font-bold mb-6">Your outlets</h1>
          
          <div className="w-full max-w-3xl">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
              {outlets.map((outlet, index) => (
                <div 
                  key={outlet.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${index !== outlets.length - 1 ? 'border-b border-gray-200' : ''}`}
                >
                  <h3 className="font-medium">{outlet.name}</h3>
                  <p className="text-gray-500 text-sm">{outlet.address}</p>
                </div>
              ))}
            </div>
            
            <Button
              onClick={() => router.push('/account/outlets/add')}
              className="w-full flex items-center justify-center py-2.5 bg-[#004851] hover:bg-[#003840] text-white rounded-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add new outlet
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 