"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"

interface MemoryPreviewProps {
  imageUrl: string;
  filterStyle?: string;
  filterIntensity?: number;
  frameType?: string;
  caption?: string;
  fontStyle?: string;
}

export default function MemoryPreview({ 
  imageUrl, 
  filterStyle = 'original',
  filterIntensity = 50,
  frameType = 'none',
  caption = '',
  fontStyle = 'handwritten'
}: MemoryPreviewProps) {
  const [isHovering, setIsHovering] = useState(false)
  const animationRef = useRef<number | null>(null)
  
  // Get filter CSS style
  const getFilterStyle = () => {
    const intensity = filterIntensity / 100;
    
    switch (filterStyle) {
      case 'polaroid':
        return {
          filter: `contrast(${1 + intensity * 0.5}) brightness(${1 + intensity * 0.2}) saturate(${1 - intensity * 0.3})`
        };
      case 'vintage':
        return {
          filter: `sepia(${intensity * 0.7}) contrast(${1 + intensity * 0.1}) brightness(${1 - intensity * 0.1})`
        };
      case 'monochrome':
        return {
          filter: `grayscale(${intensity}) contrast(${1 + intensity * 0.2})`
        };
      case 'pastel':
        return {
          filter: `brightness(${1 + intensity * 0.1}) saturate(${1 - intensity * 0.3}) contrast(${1 - intensity * 0.1})`
        };
      default:
        return {};
    }
  };

  // Get frame style class
  const getFrameClass = () => {
    switch (frameType) {
      case 'polaroid':
        return 'p-3 pb-16 bg-white shadow-xl';
      case '35mm':
        return 'p-1 border-4 border-black bg-gray-900';
      case 'instant':
        return 'p-3 pt-12 pb-12 bg-white shadow-lg border border-gray-200';
      default:
        return '';
    }
  };

  // Get font style class
  const getFontClass = () => {
    switch (fontStyle) {
      case 'handwritten':
        return 'font-serif italic';
      case 'typewriter':
        return 'font-mono';
      case 'neon':
        return 'font-bold text-white text-shadow';
      default:
        return 'font-sans';
    }
  };
  
  useEffect(() => {
    if (isHovering) {
      const startTime = Date.now()
      
      const animate = () => {
        // Add subtle hover effects if desired
        animationRef.current = window.requestAnimationFrame(animate)
      }
      
      animationRef.current = window.requestAnimationFrame(animate)
      
      return () => {
        if (animationRef.current) {
          window.cancelAnimationFrame(animationRef.current)
        }
      }
    }
  }, [isHovering])

  return (
    <Card
      className="overflow-hidden relative cursor-pointer shadow-lg transition-shadow hover:shadow-xl"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className={`relative aspect-square w-full ${getFrameClass()}`}>
        {/* Image with filters */}
        <div className="w-full h-full relative">
          <img 
            src={imageUrl}
            alt="Memory photo"
            className={`w-full h-full object-cover transition-all duration-500 ${isHovering ? "scale-[1.02]" : ""}`}
            style={getFilterStyle()}
          />
        </div>

        {/* Caption */}
        {caption && (
          <div className={`absolute bottom-4 w-full text-center ${getFontClass()}`}>
            <p className="text-xl px-4">{caption}</p>
          </div>
        )}
        
        {/* Grain effect overlay for vintage looks */}
        {(filterStyle === 'vintage' || filterStyle === 'polaroid') && (
          <div className="absolute inset-0 bg-[url('/grain.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
        )}
        
        {/* Subtle light effect on hover */}
        {isHovering && (
          <div className="absolute inset-0 bg-white/5 pointer-events-none"></div>
        )}
      </div>
    </Card>
  )
}
