"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { connectWallet, mintNFT } from "@/lib/blockchain-service"

interface NFTMintingProps {
  imageUrl: string;
  emotion: {
    primaryEmotion: string;
    emotionalTone: string;
  };
  onBack?: () => void;
}

export default function NFTMinting({ imageUrl, emotion, onBack }: NFTMintingProps) {
  const [name, setName] = useState("My Memory Frame")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [mintedNFT, setMintedNFT] = useState<{
    tokenId: string
    tokenURI: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleMint = async () => {
    if (!name) {
      toast.error("Please provide a name for your NFT.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // 1. Create metadata and get tokenURI
      const metadataResponse = await fetch("/api/mint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl,
          name,
          description,
          attributes: [
            {
              trait_type: "Filter",
              value: emotion.primaryEmotion
            },
            {
              trait_type: "Caption",
              value: emotion.emotionalTone || "None"
            },
            {
              trait_type: "Creation Date",
              value: new Date().toISOString().split('T')[0]
            }
          ]
        }),
      })

      if (!metadataResponse.ok) {
        throw new Error("Failed to create metadata")
      }

      const { tokenURI } = await metadataResponse.json()

      // 2. Connect wallet
      const signer = await connectWallet()

      // 3. Mint NFT
      const result = await mintNFT(signer, tokenURI)

      setMintedNFT({
        tokenId: result.tokenId,
        tokenURI: result.tokenURI,
      })
      toast.success(`Successfully minted NFT with ID: ${result.tokenId}`)
    } catch (err: any) {
      console.error("Minting error:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to mint NFT"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <CardTitle>Mint Your Memory as NFT</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center mb-6">
          <div className="w-48 h-48 relative rounded-md overflow-hidden">
            <img
              src={imageUrl}
              alt="NFT Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nft-name">NFT Name</Label>
          <Input
            id="nft-name"
            placeholder="My Memory Frame"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading || !!mintedNFT}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nft-description">Description (Optional)</Label>
          <Textarea
            id="nft-description"
            placeholder="A special memory captured and preserved as an NFT..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading || !!mintedNFT}
          />
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
          <h3 className="text-sm font-medium mb-2">NFT Properties</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Filter:</span>
              <span>{emotion.primaryEmotion}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Caption:</span>
              <span>{emotion.emotionalTone || "None"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {mintedNFT && (
          <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4 mt-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">NFT Minted Successfully</h3>
                <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                  <p>Token ID: {mintedNFT.tokenId}</p>
                  <p className="mt-1">
                    Token URI:{" "}
                    <a href={mintedNFT.tokenURI} target="_blank" rel="noopener noreferrer" className="underline">
                      {mintedNFT.tokenURI}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 mt-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleMint}
          disabled={isLoading || !imageUrl || !!mintedNFT}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Minting...
            </>
          ) : mintedNFT ? (
            "Minted Successfully"
          ) : (
            "Mint NFT"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
