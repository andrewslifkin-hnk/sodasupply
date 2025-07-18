"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ChevronRight } from "lucide-react"
import { useStore } from "@/context/store-context"
import { useState } from "react"
import { RewardDetailsSheet } from "@/components/club/reward-details-sheet"
import { RewardSummarySheet } from "@/components/club/reward-summary-sheet"
import { RewardConfirmationSheet } from "@/components/club/reward-confirmation-sheet"
import { useCart } from "@/context/cart-context"
import { useI18n } from "@/context/i18n-context"

interface RewardItem {
  id: number
  name: string
  points: number
  category: string
  image: string
}

export default function ClubPage() {
  const { selectedStore } = useStore()
  const { addToCart } = useCart()
  const { t } = useI18n()
  const [selectedFilter, setSelectedFilter] = useState("All")
  
  // State for the reward flow
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isSummaryOpen, setIsSummaryOpen] = useState(false)
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  
  // Example reward items based on screenshot
  const rewardItems = [
    { id: 1, name: "5,000Ks Mobile TopUp", points: 90, category: "Voucher", image: "/images/mobile-topup.svg" },
    { id: 2, name: "10,000Ks Mobile TopUp", points: 180, category: "Voucher", image: "/images/mobile-topup.svg" },
    { id: 3, name: "30,000Ks Mobile TopUp", points: 540, category: "Voucher", image: "/images/mobile-topup.svg" },
    { id: 4, name: "Powerbank - 20000mAh", points: 1200, category: "Electronics", image: "/images/powerbank.svg" },
    { id: 5, name: "XiaoMi Smart Camera C300", points: 3500, category: "Electronics", image: "/images/placeholder.svg" },
    { id: 6, name: "Rechargeable Table Fan", points: 3500, category: "Home appliance", image: "/images/placeholder.svg" },
    { id: 7, name: "Midea Air Cooler 120-15F", points: 8100, category: "Home appliance", image: "/images/placeholder.svg" },
    { id: 8, name: "Samsung Non-Smart TV 32 inches", points: 11000, category: "Electronics", image: "/images/placeholder.svg" },
    { id: 9, name: "Samsung Galaxy A06 (6GB/128GB)", points: 13500, category: "Electronics", image: "/images/placeholder.svg" },
    { id: 10, name: "CTECH (GT500) Power Station (500W,518Wh)", points: 21000, category: "Electronics", image: "/images/placeholder.svg" },
  ]

  // Filter items based on selected category
  const filteredItems = selectedFilter === "All" 
    ? rewardItems 
    : rewardItems.filter(item => item.category === selectedFilter)
    
  // Handlers for the reward flow
  const handleRewardClick = (item: RewardItem) => {
    setSelectedReward(item)
    setIsDetailsOpen(true)
  }
  
  const handleClaimReward = () => {
    setIsDetailsOpen(false)
    setIsSummaryOpen(true)
  }
  
  const handleCancelClaim = () => {
    setIsSummaryOpen(false)
  }
  
  const handleRedeemPoints = () => {
    if (selectedReward) {
      // In a real app, you would send a request to the server to redeem points
      // and process the reward
      
      // Add the reward to cart (for demonstration purposes)
      addToCart({
        id: selectedReward.id,
        name: selectedReward.name,
        price: 0, // Reward items are free as they're purchased with points
        image: selectedReward.image,
        type: selectedReward.category,
        size: "1 unit"
      })
      
      // Show confirmation
      setIsSummaryOpen(false)
      setIsConfirmationOpen(true)
    }
  }
  
  const handleBackToClub = () => {
    setIsConfirmationOpen(false)
    setSelectedReward(null)
  }

  const categoryLabels: Record<string, string> = {
    "All": t('common.view_all'),
    "Electronics": t('filters.electronics'),
    "Home appliance": t('filters.home_appliance'),
    "Voucher": t('filters.voucher')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{t('club.supply_club')}</h1>
        
        {/* Points card */}
        <div className="bg-black text-white rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm mb-1">{selectedStore?.name || "My Store"}</p>
              <h2 className="text-3xl font-bold text-white">9783 {t('club.points')}</h2>
              <Button variant="link" className="text-white p-0 mt-2 h-auto flex items-center">
                {t('club.view_activity')} <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 9V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
                <circle cx="9" cy="13" r="1"></circle>
                <circle cx="13" cy="13" r="1"></circle>
                <path d="M13 17v3h4a2 2 0 0 0 2-2v-4h-3"></path>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Redeem section */}
        <h2 className="text-xl font-bold mb-4">{t('club.redeem_your_points')}</h2>
        
        {/* Category filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {["All", "Electronics", "Home appliance", "Voucher"].map(category => (
            <button
              key={category}
              onClick={() => setSelectedFilter(category)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                selectedFilter === category 
                  ? "bg-black text-white" 
                  : "bg-white border border-gray-300 text-gray-700"
              }`}
            >
              {categoryLabels[category] || category}
            </button>
          ))}
        </div>
        
        {/* Reward items grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-lg overflow-hidden border border-gray-100">
              <div className="aspect-square bg-gray-100 flex items-center justify-center p-6">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={120}
                  height={120}
                  className="object-contain"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-sm mb-2 line-clamp-2">{item.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{item.category}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs px-3 py-1 h-auto"
                    onClick={() => handleRewardClick(item)}
                  >
                    {t('club.redeem_points', { points: item.points })}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      <Footer />
      
      {/* Reward flow sheets */}
      <RewardDetailsSheet
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        item={selectedReward}
        onClaimReward={handleClaimReward}
      />
      
      <RewardSummarySheet
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        item={selectedReward}
        onRedeem={handleRedeemPoints}
        onCancel={handleCancelClaim}
      />
      
      <RewardConfirmationSheet
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        item={selectedReward}
        onBackToClub={handleBackToClub}
      />
    </div>
  )
} 