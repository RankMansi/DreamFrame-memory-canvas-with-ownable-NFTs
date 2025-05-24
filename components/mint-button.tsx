"use client";

import { useState } from "react";
import { useMintNFT } from "@/hooks/useMintNFT";

export default function MintButton() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const { mint } = useMintNFT();
  const [minted, setMinted] = useState(false);

  const handleMint = async () => {
    if (!file) return alert("No image selected");

    try {
      const receipt = await mint(file, { name, description: desc });
      console.log("NFT Minted!", receipt);
      setMinted(true);
    } catch (err) {
      console.error("Mint failed:", err);
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow">
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <input
        type="text"
        placeholder="Artwork Title"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="block my-2 w-full border rounded p-2"
      />
      <textarea
        placeholder="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        className="block w-full border rounded p-2"
      />
      <button onClick={handleMint} className="mt-4 bg-black text-white px-4 py-2 rounded">
        Mint NFT
      </button>
      {minted && <p className="text-green-500 mt-2">Minted Successfully!</p>}
    </div>
  );
}
