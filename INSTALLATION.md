# DreamFrame Installation and Usage Guide

This guide will walk you through setting up and running the DreamFrame application - a memory photo aesthetic editor with NFT minting capabilities.

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- MetaMask browser extension for NFT minting

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository (replace with your actual repo URL)
git clone https://github.com/yourusername/dreamframe.git
cd dreamframe

# Install dependencies
npm install
```

This will also automatically download the required face detection models for AI features.

### Step 2: Set Up Local Blockchain (for NFT Minting)

```bash
# Start a local Hardhat blockchain node
npm run blockchain
```

This will:
- Start a local blockchain on http://localhost:8545
- Deploy the NFT smart contract
- Fund test accounts with ETH for minting

Keep this terminal window open and running.

### Step 3: Start the Development Server

Open a new terminal and run:

```bash
npm run dev
```

The application should now be running at [http://localhost:3000](http://localhost:3000).

## 📸 Using DreamFrame

### Basic Photo Editing

1. **Upload a Photo**
   - Go to the Transform page
   - Drag and drop an image or click to browse and select
   
2. **Apply Basic Filters**
   - Choose from filter presets (Polaroid, Vintage, Monochrome, Pastel)
   - Adjust intensity slider to control filter strength
   - Select a frame style (Polaroid, 35mm Slide, Retro Instant)
   - Add a caption and choose a font style
   
3. **Download/Save Your Creation**
   - Click "Download" to save the edited image
   - Or click "Save to Gallery" to store it in your gallery

### Advanced Photo Editing

1. **Access Advanced Editor**
   - After uploading your photo, click "Advanced Editor"
   
2. **AI Features**
   - Click "AI Auto-Enhance" to automatically improve your photo
   - The editor will detect faces and suggest optimal caption placement
   
3. **Professional Editing Tools**
   - Use the Pintura editor's advanced tools for:
     - Precise cropping and rotation
     - Detailed color adjustments
     - Adding text overlays and annotations
     - Applying filters and effects
     
4. **Save Advanced Edits**
   - Click the checkmark when finished to apply your changes
   - This will return you to the basic editor with your advanced edits applied

### Minting as NFT

1. **Prepare MetaMask**
   - Ensure MetaMask is installed and connected to the local network (Localhost 8545)
   
2. **Mint Your Creation**
   - Click "Mint as NFT" button
   - Add a name and description for your NFT
   - Review the NFT properties (filter, caption, creation date)
   - Click "Mint NFT"
   
3. **Confirm Transaction**
   - MetaMask will prompt you to confirm the transaction
   - Approve the transaction to mint your NFT
   
4. **View Your NFT**
   - After successful minting, you'll see a confirmation with the Token ID
   - Your NFT is now preserved on the blockchain
   - You can view it in the Gallery section

## 🔧 Troubleshooting

- **Face Detection Not Working**: Ensure the models were downloaded correctly by checking the `public/models` directory. You can run `npm run download-models` to try again.
- **MetaMask Connection Issues**: Make sure you've added the local network (Localhost 8545) to MetaMask and selected it.
- **Minting Errors**: Check that the blockchain is running (`npm run blockchain`) and you have sufficient test ETH in your MetaMask wallet.
- **Advanced Editor Loading Slowly**: The Pintura editor and TensorFlow.js models are loaded on-demand and may take a few seconds on first run.

## 📱 Mobile Usage

While DreamFrame works on mobile browsers, for the best experience:
- Use a desktop or laptop computer for advanced editing features
- Ensure you have the MetaMask mobile app installed for NFT minting on mobile devices 