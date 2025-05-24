"use client"

import { Suspense, useState } from "react"
import MemoryPhotoEditor from "@/components/MemoryPhotoEditor"
import NFTMinting from "@/components/nft-minting"
import MetamaskGuide from "@/components/metamask-guide"
import { Button } from "@/components/ui/button"
import { Loader, Image, CreditCard, HelpCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TransformPage() {
  const [mintingImage, setMintingImage] = useState<string | null>(null)
  const [showGuide, setShowGuide] = useState(false)
  
  // Handle images ready for minting
  const handleReadyToMint = (imageUrl: string) => {
    setMintingImage(imageUrl)
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-6">Transform & Mint</h1>
      <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
        Edit your photos with creative filters, add stylized captions, and mint them as NFTs to preserve your memories on the blockchain.
      </p>

      <Tabs defaultValue="editor" className="max-w-5xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="editor" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Memory Editor
          </TabsTrigger>
          <TabsTrigger value="minting" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            NFT Minting
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            MetaMask Guide
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor">
          <Suspense
            fallback={
              <div className="flex justify-center p-12">
                <Loader className="animate-spin h-8 w-8" />
              </div>
            }
          >
            <MemoryPhotoEditor onReadyToMint={handleReadyToMint} />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="minting">
          <Suspense
            fallback={
              <div className="flex justify-center p-12">
                <Loader className="animate-spin h-8 w-8" />
              </div>
            }
          >
            {mintingImage ? (
              <NFTMinting 
                imageUrl={mintingImage} 
                emotion={{
                  primaryEmotion: "memory", 
                  emotionalTone: "Memory Card"
                }}
                onBack={() => setMintingImage(null)}
              />
            ) : (
              <div className="text-center py-16 space-y-4">
                <h3 className="text-xl font-medium">Ready to Mint Your Memory?</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Create and customize your memory card first in the editor tab, then click "Mint as NFT" to preserve it on the blockchain.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => document.querySelector('[data-value="editor"]')?.click()}
                >
                  Go to Editor
                </Button>
              </div>
            )}
          </Suspense>
        </TabsContent>
        
        <TabsContent value="guide">
          <Suspense
            fallback={
              <div className="flex justify-center p-12">
                <Loader className="animate-spin h-8 w-8" />
              </div>
            }
          >
            <MetamaskGuide />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
