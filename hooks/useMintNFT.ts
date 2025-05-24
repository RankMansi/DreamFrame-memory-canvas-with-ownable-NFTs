import { useAccount } from 'wagmi';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { getNFTContract } from '@/lib/contract';
import { uploadToIPFS } from '@/lib/ipfs';

export const useMintNFT = () => {
  const { address } = useAccount();

  const mint = async (imageFile: File, metadata: { name: string; description: string }) => {
    if (!address || !window.ethereum) throw new Error("Wallet not connected");
    
    // Get provider and signer with ethers v6
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    const tokenURI = await uploadToIPFS(imageFile, metadata);
    const contract = getNFTContract(signer);

    const tx = await contract.mintNFT(address, tokenURI);
    const receipt = await tx.wait();
    return receipt;
  };

  return { mint };
};
