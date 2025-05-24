import { ethers } from "ethers"
import DreamFrameNFTArtifact from "../artifacts/contracts/DreamFrameNFT.sol/DreamFrameNFT.json"
import contractConfig from "./contract-config.json"

// Use the contract address from config
let contractAddress = contractConfig.address || ""

export const setContractAddress = (address: string) => {
  contractAddress = address
}

export const getContractAddress = () => contractAddress

export const getProvider = () => {
  return new ethers.JsonRpcProvider("http://localhost:8545")
}

export const getContract = (providerOrSigner: any) => {
  if (!contractAddress) {
    throw new Error("Contract address not set. Please deploy the contract first.")
  }

  return new ethers.Contract(contractAddress, DreamFrameNFTArtifact.abi, providerOrSigner)
}

export const mintNFT = async (signer: any, tokenURI: string) => {
  const contract = getContract(signer)
  const address = await signer.getAddress()

  const tx = await contract.mintNFT(address, tokenURI)
  const receipt = await tx.wait()

  // Find the NFTMinted event
  const event = receipt.logs
    .map((log: any) => {
      try {
        return contract.interface.parseLog(log)
      } catch (e) {
        return null
      }
    })
    .find((event: any) => event && event.name === "NFTMinted")

  if (!event) {
    throw new Error("NFTMinted event not found")
  }

  return {
    tokenId: event.args.tokenId.toString(),
    tokenURI: event.args.tokenURI,
    owner: event.args.owner,
  }
}

export const connectWallet = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed")
  }

  await window.ethereum.request({ method: "eth_requestAccounts" })

  const provider = new ethers.BrowserProvider(window.ethereum)
  const network = await provider.getNetwork()

  // Check if connected to localhost (chainId 1337)
  if (network.chainId !== 1337n) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x539" }], // 1337 in hex
      })
    } catch (error: any) {
      // If the chain hasn't been added to MetaMask
      if (error.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x539",
              chainName: "Localhost 8545",
              nativeCurrency: {
                name: "Ethereum",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: ["http://localhost:8545"],
            },
          ],
        })
      } else {
        throw error
      }
    }
  }

  const signer = await provider.getSigner()
  return signer
}

// Add types for window.ethereum
declare global {
  interface Window {
    ethereum: any
  }
}
