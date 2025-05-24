"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader, ExternalLink } from "lucide-react"
import { getContractAddress } from "@/lib/blockchain-service"

interface NFTDetailsProps {
  tokenId: string
  tokenURI: string
}

export default function NFTDetails({ tokenId, tokenURI }: NFTDetailsProps) {
  const [metadata, setMetadata] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const contractAddress = getContractAddress()

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(tokenURI)
        if (response.ok) {
          const data = await response.json()
          setMetadata(data)
        }
      } catch (error) {
        console.error("Error fetching metadata:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetadata()
  }, [tokenURI])

  return (
    <Card>
      <CardHeader>
        <CardTitle>NFT Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div>
              <p className="font-medium">Token ID</p>
              <p className="text-sm text-muted-foreground">{tokenId}</p>
            </div>

            <div>
              <p className="font-medium">Contract Address</p>
              <p className="text-sm text-muted-foreground break-all">{contractAddress}</p>
            </div>

            {metadata && (
              <>
                <div>
                  <p className="font-medium">Name</p>
                  <p className="text-sm text-muted-foreground">{metadata.name}</p>
                </div>

                {metadata.description && (
                  <div>
                    <p className="font-medium">Description</p>
                    <p className="text-sm text-muted-foreground">{metadata.description}</p>
                  </div>
                )}
              </>
            )}

            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open(`/api/metadata/${tokenURI.split("/").pop()}`, "_blank")}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View Metadata
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
