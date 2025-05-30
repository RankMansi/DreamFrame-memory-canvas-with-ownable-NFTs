# 📸 DreamFrame: Memory Photo Aesthetic & NFT Minting

DreamFrame is a photo editing application that allows users to transform their photos with aesthetic filters and mint them as NFTs. The application provides a user-friendly interface for photo editing and blockchain integration.

## ✨ Features

### 1. Photo Upload & Processing
- Drag & drop or file browser upload
- Support for image files (JPG, PNG)
- Basic image validation
- Loading state management

### 2. Photo Editing Suite
- **Filter Presets**
  - Polaroid
  - Vintage
  - Pastel
  - Monochrome
  - Sepia
  - Duotone
  - Neon
  - Vaporwave

- **Text Overlay Options**
  - Multiple font families (Sans, Serif, Mono, Handwritten, Sketchy)
  - Font sizes (Small to 2X-Large)
  - Font weights (Normal, Medium, Bold)
  - Text colors (Black, Gray, Blue, Red, Green, Purple, Pink, Yellow, White)
  - Text alignment (Left, Center, Right)
  - Text layouts (Normal, Circular, Wavy, Diagonal, Stacked)

### 3. NFT Minting
- ERC-721 token standard implementation
- MetaMask wallet integration
- Basic minting functionality

## 🛠️ Technical Stack

### Frontend
- **Framework**: Next.js 14.0.4
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3.3.0
- **Animations**: Framer Motion 11.0.3
- **UI Components**: 
  - Radix UI
  - shadcn/ui
  - Lucide React icons

### Blockchain Integration
- **Smart Contracts**: Hardhat 2.19.2
- **Web3**: Ethers.js 6.9.0
- **Wallet Integration**: MetaMask

### Development Tools
- TypeScript 5
- ESLint
- PostCSS
- Tailwind CSS

## 📁 Project Structure

```
dreamframe/
├── app/                 # Next.js application routes
│   ├── api/            # API routes
│   ├── create/         # Photo creation page
│   ├── gallery/        # NFT gallery
│   ├── mint/          # NFT minting page
│   └── memory-editor/  # Photo editor page
├── components/         # React components
│   ├── ui/            # UI components
│   └── MemoryPhotoEditor.tsx  # Main editor component
├── contracts/         # Smart contract source files
├── public/           # Static assets
└── scripts/          # Build and utility scripts
```

## 🚀 Getting Started

1. **Prerequisites**
   - Node.js (v16 or higher)
   - npm (v8 or higher)
   - MetaMask browser extension

2. **Installation**
   ```bash
   git clone https://github.com/yourusername/dreamframe.git
   cd dreamframe
   npm install
   ```

3. **Development**
   ```bash
   # Start development server
   npm run dev
   ```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📱 Mobile Support

- Responsive design for all screen sizes
- Touch-friendly interface
- MetaMask mobile app integration

## 🔒 Security Features

- Basic file type validation
- MetaMask transaction verification

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

*Built with Next.js, React, and Web3 technologies*
