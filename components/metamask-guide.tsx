"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from 'lucide-react'

export default function MetamaskGuide() {
  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Connect MetaMask & Mint NFTs</CardTitle>
        <CardDescription>Follow these steps to mint your memories as NFTs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Step 1: Install MetaMask</h3>
          <p className="text-muted-foreground text-sm">
            If you don't have MetaMask installed, download and install it from the official website.
          </p>
          <a 
            href="https://metamask.io/download/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm flex items-center text-blue-600 hover:underline gap-1"
          >
            Get MetaMask <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Step 2: Connect to Local Blockchain</h3>
          <p className="text-muted-foreground text-sm">
            For development, you need to connect to the local blockchain network:
          </p>
          <ol className="list-decimal list-inside text-sm space-y-1">
            <li>Open MetaMask and click on the network dropdown at the top</li>
            <li>Select "Add Network" or "Custom RPC"</li>
            <li>Enter the following details:
              <ul className="list-disc list-inside ml-4 text-xs">
                <li>Network Name: <span className="font-mono">Localhost 8545</span></li>
                <li>New RPC URL: <span className="font-mono">http://localhost:8545</span></li>
                <li>Chain ID: <span className="font-mono">1337</span></li>
                <li>Currency Symbol: <span className="font-mono">ETH</span></li>
              </ul>
            </li>
            <li>Click "Save" to add the network</li>
          </ol>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Step 3: Mint Your Memory as NFT</h3>
          <p className="text-muted-foreground text-sm">
            Once connected, follow these steps to mint your NFT:
          </p>
          <ol className="list-decimal list-inside text-sm space-y-1">
            <li>Create and customize your memory in the editor</li>
            <li>Click "Mint as NFT" to prepare your image</li>
            <li>Switch to the "NFT Minting" tab</li>
            <li>Fill in the NFT name and description</li>
            <li>Click "Mint NFT"</li>
            <li>Approve the transaction in MetaMask when prompted</li>
          </ol>
        </div>

        <div className="mt-4 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-md text-amber-800 dark:text-amber-300 text-sm">
          <p className="font-medium">Important Note:</p>
          <p className="text-xs mt-1">
            For this demo, we're using a local blockchain. In a production environment, 
            you would connect to Ethereum mainnet or a testnet like Goerli or Sepolia.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => window.open('https://docs.metamask.io/guide/', '_blank')}
        >
          Learn More About MetaMask
        </Button>
      </CardFooter>
    </Card>
  )
} 