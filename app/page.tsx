import Link from "next/link"
import { ArrowRight, Camera, Palette, Tag } from "lucide-react"
import HeroSection from "@/components/hero-section"
import FeatureSection from "@/components/feature-section"
import HowItWorks from "@/components/how-it-works"
import TechStack from "@/components/tech-stack"

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection
        title="Transform Your Memory Photos"
        subtitle="Upload your cherished photos, apply aesthetic filters and frames, then mint them as NFTs to preserve forever."
        ctaText="Transform a Photo"
        ctaLink="/create"
      />

      <FeatureSection
        title="What DreamFrame Offers"
        description="Our platform gives you tools to transform ordinary photos into aesthetic masterpieces."
        features={[
          {
            icon: <Camera className="w-10 h-10 text-purple-500" />,
            title: "Photo Upload & Preview",
            description: "Drag & drop or browse to upload a personal memory photo.",
          },
          {
            icon: <Palette className="w-10 h-10 text-indigo-500" />,
            title: "Aesthetic Filter Suite",
            description: "Choose from beautiful filter presets like Polaroid, Vintage, and Monochrome. Fine-tune intensity and add frames.",
          },
          {
            icon: <Tag className="w-10 h-10 text-pink-500" />,
            title: "NFT Minting",
            description: "Preserve your memories forever by minting them as unique NFTs on the blockchain.",
          },
        ]}
      />

      <HowItWorks
        title="How It Works"
        steps={[
          {
            number: 1,
            title: "Upload",
            description: "Select a cherished photo from your device.",
          },
          {
            number: 2,
            title: "Transform",
            description: "Apply filters, frames, and add custom captions.",
          },
          {
            number: 3,
            title: "Mint or Download",
            description: "Save your creation locally or mint it as an NFT.",
          },
        ]}
      />

      <TechStack />

      <div className="py-24 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-950/30 dark:to-indigo-950/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Memories?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Turn your family photos, travel snapshots, or candid moments into aesthetic art.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-8 py-3 text-lg bg-purple-600 hover:bg-purple-700 text-white rounded-md"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  )
}
