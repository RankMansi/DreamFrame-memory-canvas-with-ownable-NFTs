import MintButton from "@/components/mint-button";
import { WalletConnect } from "@/components/wallet-connect";

export default function MintPage() {
  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Mint Your DreamFrame</h1>
      <WalletConnect />
      <MintButton />
    </main>
  );
}
