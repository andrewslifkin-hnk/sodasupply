"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ChevronRight, Store, User, Lock, MessageSquare } from "lucide-react"

export default function AccountPage() {
  const router = useRouter()
  
  // Mock user data - in a real app, this would come from a user context or API
  const user = {
    name: "User Heineken",
    email: "user@example.com",
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 max-w-site py-8">
        <div className="content-container">
          <div className="mb-6">
            <h1 className="text-xl font-semibold mb-1">Hi there,</h1>
            <p className="text-gray-500 text-sm">{user.name}</p>
          </div>
          
          <div className="w-full max-w-3xl">
            {/* Outlets */}
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 bg-white rounded-lg border border-gray-200 mb-2"
              onClick={() => router.push('/account/outlets')}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#004851] flex items-center justify-center mr-3">
                  <Store className="h-5 w-5 text-white" />
                </div>
                <span>Outlets</span>
              </div>
              <div className="flex items-center text-gray-400">
                <span className="mr-2">3</span>
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
            
            {/* Personal Information */}
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 bg-white rounded-lg border border-gray-200 mb-2"
              onClick={() => router.push('/account/personal-information')}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#004851] flex items-center justify-center mr-3">
                  <User className="h-5 w-5 text-white" />
                </div>
                <span>Personal information</span>
              </div>
              <div className="flex items-center text-gray-400">
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
            
            {/* Login & Security */}
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 bg-white rounded-lg border border-gray-200 mb-2"
              onClick={() => router.push('/account/security')}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#004851] flex items-center justify-center mr-3">
                  <Lock className="h-5 w-5 text-white" />
                </div>
                <span>Login & security</span>
              </div>
              <div className="flex items-center text-gray-400">
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
            
            {/* Communication Preferences */}
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 bg-white rounded-lg border border-gray-200 mb-6"
              onClick={() => router.push('/account/communication')}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#004851] flex items-center justify-center mr-3">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <span>Communication preferences</span>
              </div>
              <div className="flex items-center text-gray-400">
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
            
            {/* Need help section */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="font-medium mb-1">Need help?</h2>
              <p className="text-gray-500 text-sm mb-3">Find answers and contact details on our support page.</p>
              <Button
                onClick={() => router.push('/support')}
                className="bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-md px-4 py-2 h-auto"
              >
                Get support
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 