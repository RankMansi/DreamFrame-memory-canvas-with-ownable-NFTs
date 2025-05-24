"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Expand } from "lucide-react"

// Mock data for gallery items
const mockGalleryItems = [
  {
    id: 1,
    imageUrl: "/placeholder.svg?height=400&width=400",
    title: "Stormy Night",
    emotion: "Nostalgia",
    date: "May 1, 2025",
  },
  {
    id: 2,
    imageUrl: "/placeholder.svg?height=400&width=400",
    title: "Summer Joy",
    emotion: "Happiness",
    date: "May 2, 2025",
  },
  {
    id: 3,
    imageUrl: "/placeholder.svg?height=400&width=400",
    title: "Lost Memories",
    emotion: "Melancholy",
    date: "May 3, 2025",
  },
]

export default function GalleryGrid() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {mockGalleryItems.map((item) => (
        <Card
          key={item.id}
          className="overflow-hidden group"
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div className="relative aspect-square">
            <Image
              src={item.imageUrl || "/placeholder.svg"}
              alt={item.title}
              fill
              className={`object-cover transition-all duration-500 ${
                hoveredItem === item.id ? "scale-105 blur-[1px]" : ""
              }`}
            />

            {/* Flickering overlay effect */}
            {hoveredItem === item.id && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 animate-pulse" />
            )}

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-white/80">{item.emotion}</p>
            </div>

            {hoveredItem === item.id && (
              <div className="absolute top-2 right-2 flex space-x-2">
                <Button size="icon" variant="ghost" className="bg-black/20 text-white hover:bg-black/40">
                  <Download className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="bg-black/20 text-white hover:bg-black/40">
                  <Expand className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="p-4">
            <p className="text-sm text-muted-foreground">{item.date}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
