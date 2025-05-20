"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"

interface BannerItem {
  id: string
  imageUrl: string
  title: string
  description: string
  ctaText: string
  ctaLink: string
  backgroundColor: string
}

const defaultBanners: BannerItem[] = [
  {
    id: "summer-sale",
    imageUrl: "/images/placeholder.svg",
    title: "Summer Refreshment Sale",
    description: "Beat the heat with 15% off selected drinks",
    ctaText: "Shop Now",
    ctaLink: "/products?sale=summer",
    backgroundColor: "#4FC1E9"
  },
  {
    id: "new-arrivals",
    imageUrl: "/images/placeholder.svg",
    title: "New Arrivals",
    description: "Discover our latest beverages",
    ctaText: "View Products",
    ctaLink: "/products?new=true",
    backgroundColor: "#A0D468"
  },
  {
    id: "membership",
    imageUrl: "/images/placeholder.svg",
    title: "Join Soda Club",
    description: "Subscribe & save 10% on every order",
    ctaText: "Join Now",
    ctaLink: "/club",
    backgroundColor: "#EC87C0"
  }
]

export function BannerCarousel() {
  const [mounted, setMounted] = useState(false)
  const banners = defaultBanners
  
  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true
      }}
      className="w-full mb-8"
    >
      <CarouselContent>
        {banners.map((banner) => (
          <CarouselItem key={banner.id}>
            <div
              className="relative h-[200px] w-full rounded-lg overflow-hidden flex items-center"
              style={{ backgroundColor: banner.backgroundColor }}
            >
              <div className="p-6 w-1/2 z-10 text-white">
                <h3 className="text-2xl font-bold mb-2">{banner.title}</h3>
                <p className="mb-4">{banner.description}</p>
                <Link
                  href={banner.ctaLink}
                  className="inline-flex items-center justify-center px-4 py-2 bg-white text-black font-medium rounded-md hover:bg-white/90 transition-colors"
                >
                  {banner.ctaText}
                </Link>
              </div>
              <div className="absolute right-0 h-full w-1/2">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  className="object-cover object-center"
                  priority
                />
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-end gap-2 mt-2">
        <CarouselPrevious className="relative static left-0 translate-y-0" />
        <CarouselNext className="relative static right-0 translate-y-0" />
      </div>
    </Carousel>
  )
} 