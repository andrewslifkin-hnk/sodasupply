"use client"

import type React from "react"

import Link from "next/link"
import { useFilter } from "@/context/filter-context"
import { useRouter } from "next/navigation"

export default function Footer() {
  const { clearAllFilters } = useFilter()
  const router = useRouter()

  // Handle "All Products" link click to clear all filters
  const handleAllProductsClick = (e: React.MouseEvent) => {
    e.preventDefault()
    clearAllFilters()
    router.push("/")
  }

  return (
    <footer className="bg-black text-white py-8 mt-12">
      <div className="max-w-site">
        <div className="content-container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4 tracking-[-2px]">SodaSupply</h3>
              <p className="text-white/70 text-sm">
                Your one-stop shop for premium beverages and more. Discover quality products at competitive prices.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-4">Shop</h4>
              <ul className="space-y-2 text-white/70">
                <li>
                  <Link href="/" className="hover:text-white transition-colors" onClick={handleAllProductsClick}>
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Featured
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Deals & Discounts
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-white/70">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Press
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Support</h4>
              <ul className="space-y-2 text-white/70">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/70 text-sm">
            <p>© 2025 SodaSupply. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
