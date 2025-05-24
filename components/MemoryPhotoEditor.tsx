"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, RotateCw, Download, Type, AlignLeft, AlignCenter, AlignRight, CreditCard } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardFront, CardBack } from "@/components/ui/card";
import { applyPolaroidFrame, applyVintageFilter } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

// Define filter presets
const FILTERS = {
  NONE: 'none',
  POLAROID: 'polaroid',
  VINTAGE: 'vintage',
  PASTEL: 'pastel',
  MONOCHROME: 'monochrome',
  SEPIA: 'sepia',
  DUOTONE: 'duotone',
  NEON: 'neon',
  VAPORWAVE: 'vaporwave',
};

// Font options
const FONTS = [
  { id: 'sans', name: 'Sans', className: 'font-sans' },
  { id: 'serif', name: 'Serif', className: 'font-serif' },
  { id: 'mono', name: 'Mono', className: 'font-mono' },
  { id: 'cursive', name: 'Handwritten', className: 'font-["Segoe_Script","cursive"]' },
  { id: 'caveat', name: 'Sketchy', className: 'font-caveat' },
];

// Font sizes
const FONT_SIZES = [
  { id: 'sm', name: 'Small', className: 'text-sm' },
  { id: 'base', name: 'Medium', className: 'text-base' },
  { id: 'lg', name: 'Large', className: 'text-lg' },
  { id: 'xl', name: 'X-Large', className: 'text-xl' },
  { id: '2xl', name: '2X-Large', className: 'text-2xl' },
];

// Font weights
const FONT_WEIGHTS = [
  { id: 'normal', name: 'Normal', className: 'font-normal' },
  { id: 'medium', name: 'Medium', className: 'font-medium' },
  { id: 'bold', name: 'Bold', className: 'font-bold' },
];

// Text layout options
const TEXT_LAYOUTS = [
  { id: 'normal', name: 'Normal' },
  { id: 'circular', name: 'Circular' },
  { id: 'wavy', name: 'Wavy' },
  { id: 'diagonal', name: 'Diagonal' },
  { id: 'stacked', name: 'Stacked' },
];

// Text colors with more options
const TEXT_COLORS = [
  { id: 'black', name: 'Black', className: 'text-black', value: '#000000' },
  { id: 'gray', name: 'Gray', className: 'text-gray-600', value: '#4B5563' },
  { id: 'blue', name: 'Blue', className: 'text-blue-600', value: '#2563EB' },
  { id: 'red', name: 'Red', className: 'text-red-600', value: '#DC2626' },
  { id: 'green', name: 'Green', className: 'text-green-600', value: '#16A34A' },
  { id: 'purple', name: 'Purple', className: 'text-purple-600', value: '#9333EA' },
  { id: 'pink', name: 'Pink', className: 'text-pink-500', value: '#EC4899' },
  { id: 'yellow', name: 'Yellow', className: 'text-yellow-500', value: '#EAB308' },
  { id: 'white', name: 'White', className: 'text-white', value: '#FFFFFF' },
];

// Text alignment options
const TEXT_ALIGNMENTS = [
  { id: 'left', name: 'Left', className: 'text-left', icon: AlignLeft },
  { id: 'center', name: 'Center', className: 'text-center', icon: AlignCenter },
  { id: 'right', name: 'Right', className: 'text-right', icon: AlignRight },
];

// Add interface for component props
interface MemoryPhotoEditorProps {
  onReadyToMint?: (imageUrl: string) => void;
}

export default function MemoryPhotoEditor({ onReadyToMint }: MemoryPhotoEditorProps = {}) {
  // State for the uploaded image
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  // State for the applied filter
  const [activeFilter, setActiveFilter] = useState<string>(FILTERS.POLAROID);
  
  // State for the card flip
  const [isFlipped, setIsFlipped] = useState(false);
  
  // State for the caption/description
  const [caption, setCaption] = useState<string>('');
  
  // State for text formatting
  const [fontFamily, setFontFamily] = useState<string>(FONTS[3].id); // Cursive default
  const [fontSize, setFontSize] = useState<string>(FONT_SIZES[2].id); // Large default
  const [fontWeight, setFontWeight] = useState<string>(FONT_WEIGHTS[0].id); // Normal default
  const [textColor, setTextColor] = useState<string>(TEXT_COLORS[0].id); // Black default
  const [textAlignment, setTextAlignment] = useState<string>(TEXT_ALIGNMENTS[1].id); // Center default
  const [textLayout, setTextLayout] = useState<string>(TEXT_LAYOUTS[0].id); // Normal default

  // Loading state for operations
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Refs for the canvas elements (front and back)
  const frontCanvasRef = useRef<HTMLCanvasElement>(null);
  const backCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Find the current font settings
  const currentFont = FONTS.find(f => f.id === fontFamily) || FONTS[0];
  const currentFontSize = FONT_SIZES.find(f => f.id === fontSize) || FONT_SIZES[0];
  const currentFontWeight = FONT_WEIGHTS.find(f => f.id === fontWeight) || FONT_WEIGHTS[0];
  const currentTextColor = TEXT_COLORS.find(c => c.id === textColor) || TEXT_COLORS[0];
  const currentTextAlignment = TEXT_ALIGNMENTS.find(a => a.id === textAlignment) || TEXT_ALIGNMENTS[0];
  
  // Handle file upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImage(event.target.result as string);
          setIsLoading(false);
        }
      };
      reader.onerror = () => {
        toast.error('Error reading file');
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle drag and drop
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImage(event.target.result as string);
          setIsLoading(false);
        }
      };
      reader.onerror = () => {
        toast.error('Error reading file');
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle flipping the card
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };
  
  // Render the front side of the memory card
  useEffect(() => {
    if (!uploadedImage || !frontCanvasRef.current) return;
    
    const canvas = frontCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Reset canvas and size it to the image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the base image
      ctx.drawImage(img, 0, 0);
      
      // Apply selected filter
      switch (activeFilter) {
        case FILTERS.VINTAGE:
          applyVintageFilter(ctx, canvas.width, canvas.height);
          break;
        case FILTERS.PASTEL:
          // Apply pastel filter
          const pastelData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pastelPixels = pastelData.data;
          
          for (let i = 0; i < pastelPixels.length; i += 4) {
            // Lighten and desaturate slightly for pastel effect
            pastelPixels[i] = Math.min(255, pastelPixels[i] * 0.9 + 40); // R
            pastelPixels[i + 1] = Math.min(255, pastelPixels[i + 1] * 0.9 + 40); // G
            pastelPixels[i + 2] = Math.min(255, pastelPixels[i + 2] * 0.9 + 40); // B
          }
          
          ctx.putImageData(pastelData, 0, 0);
          break;
        case FILTERS.MONOCHROME:
          // Apply black and white filter
          const monochromeData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const monochromePixels = monochromeData.data;
          
          for (let i = 0; i < monochromePixels.length; i += 4) {
            const grayscale = monochromePixels[i] * 0.3 + monochromePixels[i + 1] * 0.59 + monochromePixels[i + 2] * 0.11;
            monochromePixels[i] = grayscale; // R
            monochromePixels[i + 1] = grayscale; // G
            monochromePixels[i + 2] = grayscale; // B
          }
          
          ctx.putImageData(monochromeData, 0, 0);
          break;
        case FILTERS.SEPIA:
          // Apply sepia filter
          const sepiaData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const sepiaPixels = sepiaData.data;
          
          for (let i = 0; i < sepiaPixels.length; i += 4) {
            const r = sepiaPixels[i];
            const g = sepiaPixels[i + 1];
            const b = sepiaPixels[i + 2];
            
            sepiaPixels[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189)); // R
            sepiaPixels[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168)); // G
            sepiaPixels[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131)); // B
          }
          
          ctx.putImageData(sepiaData, 0, 0);
          break;
        case FILTERS.DUOTONE:
          // Apply duotone (blue-pink) filter
          const duotoneData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const duotonePixels = duotoneData.data;
          
          for (let i = 0; i < duotonePixels.length; i += 4) {
            const grayscale = duotonePixels[i] * 0.3 + duotonePixels[i + 1] * 0.59 + duotonePixels[i + 2] * 0.11;
            duotonePixels[i] = Math.min(255, grayscale * 0.8); // R - blue tint
            duotonePixels[i + 1] = 50; // G - reduced
            duotonePixels[i + 2] = Math.min(255, grayscale * 1.2); // B - pink tint
          }
          
          ctx.putImageData(duotoneData, 0, 0);
          break;
        case FILTERS.NEON:
          // Apply neon glow effect
          const neonData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const neonPixels = neonData.data;
          
          for (let i = 0; i < neonPixels.length; i += 4) {
            neonPixels[i] = Math.min(255, neonPixels[i] * 0.7 + 80); // R
            neonPixels[i + 1] = Math.min(255, neonPixels[i + 1] * 0.4 + 50); // G
            neonPixels[i + 2] = Math.min(255, neonPixels[i + 2] * 1.5); // B - boost blue
          }
          
          ctx.putImageData(neonData, 0, 0);
          break;
        case FILTERS.VAPORWAVE:
          // Apply vaporwave aesthetic
          const vaporwaveData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const vaporwavePixels = vaporwaveData.data;
          
          for (let i = 0; i < vaporwavePixels.length; i += 4) {
            vaporwavePixels[i] = Math.min(255, vaporwavePixels[i] * 1.2); // Boost R
            vaporwavePixels[i + 1] = Math.min(255, vaporwavePixels[i + 1] * 0.8); // Reduce G
            vaporwavePixels[i + 2] = Math.min(255, vaporwavePixels[i + 2] * 1.1 + 30); // Boost B with offset
          }
          
          ctx.putImageData(vaporwaveData, 0, 0);
          break;
      }
      
      // Apply polaroid frame if needed
      if (activeFilter === FILTERS.POLAROID) {
        applyPolaroidFrame(ctx, canvas.width, canvas.height);
      }
    };
    
    img.src = uploadedImage;
  }, [uploadedImage, activeFilter]);
  
  // Render the back side of the memory card with text layout options
  useEffect(() => {
    if (!backCanvasRef.current || !frontCanvasRef.current) return;
    
    const frontCanvas = frontCanvasRef.current;
    const backCanvas = backCanvasRef.current;
    const backCtx = backCanvas.getContext('2d');
    if (!backCtx) return;
    
    // Match the back canvas size to the front canvas
    backCanvas.width = frontCanvas.width;
    backCanvas.height = frontCanvas.height;
    
    // Clear the canvas
    backCtx.clearRect(0, 0, backCanvas.width, backCanvas.height);
    
    // Draw a paper-like background
    backCtx.fillStyle = '#f8f5f1';
    backCtx.fillRect(0, 0, backCanvas.width, backCanvas.height);
    
    // Add some texture/pattern to make it look like paper
    backCtx.globalAlpha = 0.03;
    for (let i = 0; i < backCanvas.width; i += 4) {
      for (let j = 0; j < backCanvas.height; j += 4) {
        if (Math.random() > 0.75) {
          backCtx.fillStyle = '#000000';
          backCtx.fillRect(i, j, 1, 1);
        }
      }
    }
    
    // Reset alpha
    backCtx.globalAlpha = 1;
    
    // Find the matching font settings
    const font = FONTS.find(f => f.id === fontFamily)?.id || 'sans';
    const size = fontSize;
    const weight = FONT_WEIGHTS.find(w => w.id === fontWeight)?.id || 'normal';
    const color = TEXT_COLORS.find(c => c.id === textColor)?.value || '#000000';
    const alignment = TEXT_ALIGNMENTS.find(a => a.id === textAlignment)?.id || 'center';
    const layout = TEXT_LAYOUTS.find(l => l.id === textLayout)?.id || 'normal';
    
    // Set font styles
    backCtx.fillStyle = color;
    // Map font families
    let fontFamilyString = 'sans-serif';
    
    if (font === 'serif') {
      fontFamilyString = 'Georgia, serif';
    } else if (font === 'mono') {
      fontFamilyString = 'Consolas, monospace';
    } else if (font === 'cursive') {
      fontFamilyString = 'Segoe Script, cursive';
    } else if (font === 'caveat') {
      fontFamilyString = 'Caveat, cursive';
    } else {
      fontFamilyString = 'Arial, sans-serif';
    }
    
    // Map font sizes
    let fontSizePixels = 16;
    
    // Fix TypeScript error by handling string ID comparisons properly
    if (size === 'sm') {
      fontSizePixels = 18;
    } else if (size === 'base') {
      fontSizePixels = 24;
    } else if (size === 'lg') {
      fontSizePixels = 32;
    } else if (size === 'xl') {
      fontSizePixels = 40;
    } else if (size === '2xl') {
      fontSizePixels = 48;
    } else {
      fontSizePixels = 24; // Default
    }
    
    // Map font weights
    let fontWeightValue = '400';
    if (weight === 'medium') {
      fontWeightValue = '500';
    } else if (weight === 'bold') {
      fontWeightValue = '700';
    } else {
      fontWeightValue = '400';
    }
    
    backCtx.font = `${fontWeightValue} ${fontSizePixels}px ${fontFamilyString}`;
    backCtx.textBaseline = 'top';
    
    // Set text alignment
    let textX = 20;
    backCtx.textAlign = 'left';
    if (alignment === 'center') {
      textX = backCanvas.width / 2;
      backCtx.textAlign = 'center';
    } else if (alignment === 'right') {
      textX = backCanvas.width - 20;
      backCtx.textAlign = 'right';
    }
    
    // Apply different text layouts
    if (layout === 'normal') {
      // Standard layout - draw the text with word wrapping
      const words = caption.split(' ');
      const lineHeight = fontSizePixels * 1.4;
      const maxWidth = backCanvas.width - 40;
      let line = '';
      let y = 20;
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = backCtx.measureText(testLine);
        
        if (metrics.width > maxWidth && i > 0) {
          backCtx.fillText(line, textX, y);
          line = words[i] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      backCtx.fillText(line, textX, y);
    } 
    else if (layout === 'circular') {
      // Circular text layout
      const centerX = backCanvas.width / 2;
      const centerY = backCanvas.height / 2;
      const radius = Math.min(centerX, centerY) * 0.6;
      
      backCtx.save();
      backCtx.translate(centerX, centerY);
      
      const characters = caption.split('');
      const angleIncrement = (2 * Math.PI) / characters.length;
      
      for (let i = 0; i < characters.length; i++) {
        const angle = i * angleIncrement - Math.PI / 2; // Start from top
        
        backCtx.save();
        backCtx.rotate(angle);
        backCtx.translate(0, -radius);
        backCtx.rotate(Math.PI / 2); // Rotate text to face outward
        backCtx.fillText(characters[i], 0, 0);
        backCtx.restore();
      }
      
      backCtx.restore();
    }
    else if (layout === 'wavy') {
      // Wavy text layout
      const startY = backCanvas.height / 2;
      const amplitude = fontSizePixels * 1.2;
      const frequency = 0.02;
      
      for (let i = 0; i < caption.length; i++) {
        const char = caption[i];
        const x = 20 + (i * fontSizePixels * 0.8);
        const y = startY + Math.sin(x * frequency) * amplitude;
        
        backCtx.save();
        backCtx.translate(x, y);
        backCtx.fillText(char, 0, 0);
        backCtx.restore();
      }
    }
    else if (layout === 'diagonal') {
      // Diagonal text layout
      backCtx.save();
      backCtx.translate(40, 40);
      backCtx.rotate(Math.PI / 8); // Rotate ~22 degrees
      
      const words = caption.split(' ');
      const lineHeight = fontSizePixels * 1.4;
      const maxWidth = backCanvas.width - 80;
      let line = '';
      let y = 0;
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = backCtx.measureText(testLine);
        
        if (metrics.width > maxWidth && i > 0) {
          backCtx.fillText(line, 0, y);
          line = words[i] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      backCtx.fillText(line, 0, y);
      
      backCtx.restore();
    }
    else if (layout === 'stacked') {
      // Stacked vertical text
      const words = caption.split(/\s+/);
      const centerX = backCanvas.width / 2;
      let y = 20;
      
      backCtx.textAlign = 'center';
      
      for (let i = 0; i < words.length; i++) {
        backCtx.fillText(words[i], centerX, y);
        y += fontSizePixels * 1.4;
      }
    }
    
    // Draw a small design element to make it look more like a real postcard back
    backCtx.strokeStyle = 'rgba(0,0,0,0.1)';
    backCtx.lineWidth = 1;
    
    // Draw "postcard" divider line
    if (alignment !== 'center' && layout === 'normal') {
      backCtx.beginPath();
      backCtx.moveTo(backCanvas.width / 2, 10);
      backCtx.lineTo(backCanvas.width / 2, backCanvas.height - 10);
      backCtx.stroke();
    }
    
  }, [uploadedImage, activeFilter, caption, fontFamily, fontSize, fontWeight, textColor, textAlignment, textLayout]);
  
  // Handle download
  const handleDownload = async () => {
    if (!frontCanvasRef.current || !backCanvasRef.current) {
      toast.error('Cannot download, canvas not ready');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create two download links, one for each side
      const frontLink = document.createElement('a');
      frontLink.download = `memory-front-${Date.now()}.png`;
      frontLink.href = frontCanvasRef.current.toDataURL('image/png');
      
      const backLink = document.createElement('a');
      backLink.download = `memory-back-${Date.now()}.png`;
      backLink.href = backCanvasRef.current.toDataURL('image/png');
      
      // Trigger downloads sequentially
      frontLink.click();
      await new Promise(resolve => setTimeout(resolve, 100));
      backLink.click();
      
      toast.success('Your memory card has been downloaded!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download image');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle minting as NFT
  const handleMintAsNFT = () => {
    if (!frontCanvasRef.current) {
      toast.error('Cannot mint, canvas not ready');
      return;
    }
    
    // Get the image data URL from the front canvas
    const imageUrl = frontCanvasRef.current.toDataURL('image/png');
    
    // Call the provided callback with the image URL
    if (onReadyToMint) {
      onReadyToMint(imageUrl);
      toast.success('Image ready for minting!');
    } else {
      toast.error('Minting functionality not available');
    }
  };
  
  // If no image uploaded yet, show the upload area
  if (!uploadedImage) {
    return (
      <div className="w-full max-w-3xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-8 text-center">Memory Photo Editor</h2>
        <div 
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragging ? 'border-purple-500 bg-purple-50/5' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            accept="image/*"
          />
          <div className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-purple-100/10 p-3 mb-4">
              <Upload className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-medium mb-2">Upload your photo</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Drag and drop an image here, or click to browse
            </p>
            <p className="text-xs text-gray-400">
              Supports JPG, PNG, WebP (max 10MB)
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Memory Photo Editor</h2>
      
      <div className="grid md:grid-cols-2 gap-8 mb-6">
        {/* Left side: Memory Card with 3D Flip Animation */}
        <div className="relative perspective-1000 min-h-[400px] flex items-center justify-center">
          <motion.div 
            className="w-full h-full relative preserve-3d"
            initial={false}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.1 }}
          >
            {/* Front Side */}
            <div 
              className={`absolute w-full h-full backface-hidden ${isFlipped ? 'opacity-0' : 'opacity-100'}`}
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="flex justify-center items-center h-full">
                <div className="relative shadow-xl transform transition-transform hover:scale-[1.01]">
                  <canvas ref={frontCanvasRef} className="max-w-full max-h-[70vh]"></canvas>
                </div>
              </div>
            </div>
            
            {/* Back Side */}
            <div 
              className={`absolute w-full h-full backface-hidden ${isFlipped ? 'opacity-100' : 'opacity-0'}`}
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <div className="flex justify-center items-center h-full">
                <div className="relative shadow-xl transform transition-transform hover:scale-[1.01]">
                  <canvas ref={backCanvasRef} className="max-w-full max-h-[70vh]"></canvas>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Flip Button */}
          <button 
            onClick={handleFlip}
            className="absolute bottom-4 right-4 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full p-2 shadow-md hover:shadow-lg transition-all"
            aria-label="Flip card"
          >
            <RotateCw className="h-5 w-5" />
          </button>
        </div>
        
        {/* Right side: Controls */}
        <div className="space-y-6">
          {/* Filter Options */}
          <div>
            <Label className="font-medium mb-2 block">Filter Style</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeFilter === FILTERS.NONE ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange(FILTERS.NONE)}
              >
                Original
              </Button>
              <Button
                variant={activeFilter === FILTERS.POLAROID ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange(FILTERS.POLAROID)}
              >
                Polaroid
              </Button>
              <Button
                variant={activeFilter === FILTERS.VINTAGE ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange(FILTERS.VINTAGE)}
              >
                Vintage
              </Button>
              <Button
                variant={activeFilter === FILTERS.PASTEL ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange(FILTERS.PASTEL)}
              >
                Pastel
              </Button>
              <Button
                variant={activeFilter === FILTERS.MONOCHROME ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange(FILTERS.MONOCHROME)}
              >
                Monochrome
              </Button>
              <Button
                variant={activeFilter === FILTERS.SEPIA ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange(FILTERS.SEPIA)}
              >
                Sepia
              </Button>
              <Button
                variant={activeFilter === FILTERS.DUOTONE ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange(FILTERS.DUOTONE)}
              >
                Duotone
              </Button>
              <Button
                variant={activeFilter === FILTERS.NEON ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange(FILTERS.NEON)}
              >
                Neon
              </Button>
              <Button
                variant={activeFilter === FILTERS.VAPORWAVE ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange(FILTERS.VAPORWAVE)}
              >
                Vaporwave
              </Button>
            </div>
          </div>
          
          {/* Text Style Controls */}
          <div>
            <Label className="font-medium mb-2 block flex items-center gap-1">
              <Type className="h-4 w-4" /> Text Styling
            </Label>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Font Family */}
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Font</Label>
                <select 
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm"
                >
                  {FONTS.map((font) => (
                    <option key={font.id} value={font.id}>{font.name}</option>
                  ))}
                </select>
              </div>
              
              {/* Font Size */}
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Size</Label>
                <select 
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm"
                >
                  {FONT_SIZES.map((size) => (
                    <option key={size.id} value={size.id}>{size.name}</option>
                  ))}
                </select>
              </div>
              
              {/* Font Weight */}
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Weight</Label>
                <select 
                  value={fontWeight}
                  onChange={(e) => setFontWeight(e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm"
                >
                  {FONT_WEIGHTS.map((weight) => (
                    <option key={weight.id} value={weight.id}>{weight.name}</option>
                  ))}
                </select>
              </div>
              
              {/* Text Color */}
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Color</Label>
                <select 
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm"
                >
                  {TEXT_COLORS.map((color) => (
                    <option key={color.id} value={color.id}>{color.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Text Alignment */}
            <div className="mb-3">
              <Label className="text-xs text-gray-500 mb-1 block">Alignment</Label>
              <div className="flex space-x-2">
                {TEXT_ALIGNMENTS.map((alignment) => {
                  const Icon = alignment.icon;
                  return (
                    <Button
                      key={alignment.id}
                      variant={textAlignment === alignment.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTextAlignment(alignment.id)}
                      className="px-3"
                    >
                      <Icon className="h-4 w-4" />
                    </Button>
                  );
                })}
              </div>
            </div>
            
            {/* Text Layout */}
            <div className="mb-3">
              <Label className="text-xs text-gray-500 mb-1 block">Text Layout</Label>
              <div className="flex flex-wrap gap-2">
                {TEXT_LAYOUTS.map((layout) => (
                  <Button
                    key={layout.id}
                    variant={textLayout === layout.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTextLayout(layout.id)}
                  >
                    {layout.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Caption/Description Editor */}
          <div>
            <Label htmlFor="caption" className="font-medium mb-2 block">
              Memory Description
            </Label>
            <div className="space-y-2">
              <Textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write your memory description here..."
                className={`min-h-[120px] ${currentFont.className} ${currentFontSize.className} ${currentFontWeight.className} ${currentTextColor.className} ${currentTextAlignment.className} dark:text-white text-black`}
              />
              <p className="text-xs text-gray-500">
                This text will appear on the back of your memory card. 
                <button 
                  type="button" 
                  className="ml-1 text-blue-500 hover:underline"
                  onClick={handleFlip}
                >
                  {isFlipped ? "View front" : "View back"}
                </button>
              </p>
            </div>
          </div>
          
          {/* Final Actions */}
          <div className="pt-4">
            <Button
              onClick={handleDownload}
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-all"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Download className="h-5 w-5" />
                  Download Memory
                </span>
              )}
            </Button>
            
            {onReadyToMint && (
              <Button
                onClick={handleMintAsNFT}
                disabled={isLoading}
                className="w-full mt-4 border border-purple-400 bg-white hover:bg-purple-50 text-purple-700 py-2 rounded-lg transition-all dark:bg-transparent dark:hover:bg-purple-950/20"
                variant="outline"
              >
                <span className="flex items-center justify-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Mint as NFT
                </span>
              </Button>
            )}
            
            <button
              onClick={() => {
                setUploadedImage(null);
                setCaption('');
                setIsFlipped(false);
              }}
              className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700 py-1"
            >
              Choose different photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 