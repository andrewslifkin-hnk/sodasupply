"use client"

import { useEffect, type RefObject, useState } from "react"

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void,
) {
  // Track touch start position for scrolling detection
  const [touchStartY, setTouchStartY] = useState<number | null>(null)
  
  useEffect(() => {
    const mouseListener = (event: MouseEvent) => {
      const el = ref?.current
      if (!el || el.contains(event.target as Node)) {
        return
      }
      handler(event)
    }
    
    const touchStartListener = (event: TouchEvent) => {
      // Store the initial touch position
      if (event.touches && event.touches.length) {
        setTouchStartY(event.touches[0].clientY)
      }
      
      // Only handle click outside if not inside the element
      const el = ref?.current
      if (!el || el.contains(event.target as Node)) {
        return
      }
      // Don't immediately trigger handler for touch events
      // We'll check if it was a scroll in the end touch event
    }
    
    const touchEndListener = (event: TouchEvent) => {
      const el = ref?.current
      if (!el || el.contains(event.target as Node)) {
        setTouchStartY(null)
        return
      }
      
      // If we have a touchStartY value and the touch moved significantly (scrolling),
      // don't trigger the handler
      if (
        touchStartY !== null && 
        event.changedTouches && 
        event.changedTouches.length && 
        Math.abs(event.changedTouches[0].clientY - touchStartY) > 10
      ) {
        // This was a scroll, not a tap
        setTouchStartY(null)
        return
      }
      
      // This was a tap outside, trigger the handler
      handler(event)
      setTouchStartY(null)
    }

    document.addEventListener("mousedown", mouseListener)
    document.addEventListener("touchstart", touchStartListener)
    document.addEventListener("touchend", touchEndListener)

    return () => {
      document.removeEventListener("mousedown", mouseListener)
      document.removeEventListener("touchstart", touchStartListener)
      document.removeEventListener("touchend", touchEndListener)
    }
  }, [ref, handler, touchStartY])
}
