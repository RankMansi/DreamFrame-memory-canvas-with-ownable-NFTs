import { Suspense } from "react"
import { Loader } from "lucide-react"
import GalleryGrid from "@/components/gallery-grid"

export default function GalleryPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Memory Gallery</h1>
      <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
        Explore your collection of emotional artworks created with DreamFrame.
      </p>

      <Suspense
        fallback={
          <div className="flex justify-center">
            <Loader className="animate-spin" />
          </div>
        }
      >
        <GalleryGrid />
      </Suspense>
    </div>
  )
}
