# 📸 DreamFrame: Memory Photo Aesthetic & NFT Minting

DreamFrame started as an AI-powered emotion-to-art app, but now it's evolving into a **memory photo aesthetic editor** with built-in NFT minting. Instead of generating images from prompts, users will **upload their own cherished photos**—for example, a childhood snapshot in your mother's arms—and transform them with beautiful, customizable filters and frames. Once perfected, each "memory frame" can be minted as a unique NFT and preserved forever on-chain.

---

## ✨ What You'll Build

1. **Photo Upload & Preview**  
   Users can drag & drop or browse to upload a personal memory photo.

2. **Aesthetic Filter Suite**  
   - Choose from pre-built filter presets (e.g. Polaroid, Vintage, Pastel, Monochrome).  
   - Fine-tune intensity, contrast, brightness, grain, and vignette.  
   - Add artistic frames or "film" borders (Polaroid style, 35 mm slide, retro instant).

3. **Custom Overlay & Text**  
   - Type a date, location, or short caption to overlay on the image.  
   - Pick fonts and placement (e.g. handwritten, typewriter, neon).

4. **Live Preview & Download**  
   See changes in real time and download your edited artwork as a high-resolution PNG.

5. **NFT Minting Extension**  
   - Upload the final image to IPFS (via Pinata or local node).  
   - Mint an ERC-721 NFT on a test or mainnet blockchain.  
   - Store metadata (caption, filter settings, original upload date) alongside image URI.  
   - View your minted token in a gallery or on OpenSea.

6. **AI-Enhanced Editing (NEW!)**
   - Professional-grade photo editing with Pintura integration
   - AI-powered auto-enhancement to optimize your photos
   - Face detection for smart caption placement
   - Advanced editing tools for precision adjustments

---

## 🚀 Why This Matters

- **Personal Storytelling**: Turn family photos, travel snapshots, or candid moments into shareable art  
- **Creative Control**: Non-technical users get professional-grade filter tools without Photoshop  
- **Digital Keepsakes**: Mint your memories as NFTs, ensuring provenance and permanence  
- **Demo-Friendly**: Fully offline or local-chain NFT minting for zero-cost prototyping  
- **AI-Assistance**: Get better results with intelligent enhancement suggestions

---

## 🛠️ Tech Stack

- **Frontend**: Next.js / React, Tailwind CSS, Framer Motion  
- **Image Editing**: 
  - Basic: Custom CSS filters and canvas-based rendering
  - Advanced: Pintura Professional Photo Editor
- **AI Features**:
  - TensorFlow.js for face detection and image analysis
  - BlazeFace for fast face recognition
  - AI-based image enhancement
- **State Management**: React Context or Zustand for filter settings  
- **IPFS Storage**: Pinata SDK or a self-hosted `go-ipfs` node  
- **Blockchain**: Ethers.js + Hardhat (local or testnet) + custom ERC-721 contract  
- **Wallet Integration**: RainbowKit / Wagmi + MetaMask

---

## 📝 How It Works (High-Level)

1. **Upload**: User selects a photo file  
2. **Filter**: Client-side image editor presents presets and sliders  
3. **Advanced Edit**: Optional professional editing with AI assistance
4. **Overlay**: User adds caption text and chooses a frame style  
5. **Finalize**: Click "Download" or "Mint NFT"  
6. **Mint Flow**:  
   - Upload to IPFS → returns `ipfs://CID`  
   - Call smart contract `mintNFT(ipfs://CID)` → returns token ID  
   - Display mint confirmation and link to token on a block explorer  

---

## 🔧 Getting Started

See [INSTALLATION.md](./INSTALLATION.md) for detailed setup and usage instructions.

---

## 📱 Live Demo

Coming soon!