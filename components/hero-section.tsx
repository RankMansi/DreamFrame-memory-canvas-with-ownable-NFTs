import { Camera } from "lucide-react"
import Link from "next/link"

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

export default function HeroSection({ title, subtitle, ctaText, ctaLink }: HeroSectionProps) {
  return (
    <section className="py-20 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="inline-flex items-center justify-center px-4 py-2 mb-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300">
          <Camera className="h-4 w-4 mr-2" />
          <span>Photo Aesthetic & NFT Minting</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-500 to-violet-600">
          {title}
        </h1>

        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {subtitle}
        </p>

        <Link href={ctaLink}>
          <button className="px-8 py-3 text-lg bg-purple-600 hover:bg-purple-700 text-white rounded-md">
            {ctaText}
          </button>
        </Link>

        <div className="relative w-full max-w-3xl mx-auto mt-12 rounded-xl overflow-hidden shadow-2xl">
          <div className="aspect-video bg-gradient-to-br from-purple-500/20 via-indigo-500/20 to-violet-500/20 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="animate-pulse mb-4">
                <Camera className="h-12 w-12 mx-auto text-purple-400" />
              </div>
              <p className="text-muted-foreground">Transform your cherished photos</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
