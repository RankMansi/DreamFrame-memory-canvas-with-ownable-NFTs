"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Loader, Upload, Image as ImageIcon, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import ArtworkPreview from "./artwork-preview"
import NFTMinting from "./nft-minting"
import EnhancedPhotoEditor from "./enhanced-photo-editor"
import { downloadMemoryCard, applyPolaroidFrame, applyVintageFilter } from "@/lib/utils"

interface PhotoEditorState {
  imageUrl: string
  filter: string
  filterIntensity: number
  frameStyle: string
  caption: string
  font: string
  advancedEdits?: any
  backSide?: string
}

export default function MemoryForm() {
  const [photo, setPhoto] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editorState, setEditorState] = useState<PhotoEditorState | null>(null)
  const [showMintingPanel, setShowMintingPanel] = useState(false)
  const [showAdvancedEditor, setShowAdvancedEditor] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.match('image.*')) {
        handleImageFile(file)
      } else {
        toast.error("Please upload an image file")
      }
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type.match('image.*')) {
        handleImageFile(file)
      } else {
        toast.error("Please upload an image file")
      }
    }
  }

  const handleImageFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        setPhoto(e.target.result as string)
        // Initialize editor state with defaults
        setEditorState({
          imageUrl: e.target.result as string,
          filter: 'original',
          filterIntensity: 50,
          frameStyle: 'none',
          caption: '',
          font: 'handwritten'
        })
      }
    }
    reader.readAsDataURL(file)
  }

  const handleFilterChange = (filter: string) => {
    if (editorState) {
      setEditorState({
        ...editorState,
        filter
      })
    }
  }

  const handleFrameChange = (frameStyle: string) => {
    if (editorState) {
      setEditorState({
        ...editorState,
        frameStyle
      })
    }
  }

  const handleIntensityChange = (intensity: number) => {
    if (editorState) {
      setEditorState({
        ...editorState,
        filterIntensity: intensity
      })
    }
  }

  const handleCaptionChange = (caption: string) => {
    if (editorState) {
      setEditorState({
        ...editorState,
        caption
      })
    }
  }

  const handleFontChange = (font: string) => {
    if (editorState) {
      setEditorState({
        ...editorState,
        font
      })
    }
  }

  const handleDownload = async () => {
    if (!editorState) return
    
    // Create a temporary canvas to render the edited image
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      toast.error("Unable to create canvas context")
      return
    }
    
    const img = new Image()
    img.crossOrigin = "Anonymous"
    
    img.onload = async () => {
      // Set canvas dimensions
      canvas.width = img.width
      canvas.height = img.height
      
      // Draw the image as-is first (it already has filters applied from Enhanced Editor)
      ctx.drawImage(img, 0, 0)
      
      // Only apply basic filters if advanced edits are not present
      if (!editorState.advancedEdits) {
        // Apply filter effects based on the editor state
        const { filter, filterIntensity } = editorState
        const intensity = filterIntensity / 100
        
        // Clear canvas and reapply with filters
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        switch (filter) {
          case 'vintage':
            ctx.filter = `sepia(${intensity * 0.7}) contrast(${1 + intensity * 0.1})`
            break
          case 'monochrome':
            ctx.filter = `grayscale(${intensity})`
            break
          case 'polaroid':
            ctx.filter = `contrast(${1 + intensity * 0.3}) brightness(${1 + intensity * 0.1}) saturate(${1 - intensity * 0.2})`
            break
          case 'pastel':
            ctx.filter = `brightness(${1 + intensity * 0.1}) saturate(${0.7}) contrast(${1 - intensity * 0.1})`
            break
          default:
            ctx.filter = 'none'
        }
        
        // Draw the image with filters
        ctx.drawImage(img, 0, 0)
      }
      
      // Apply frame if needed and not already applied by Advanced Editor
      if (editorState.frameStyle !== 'none' && !editorState.advancedEdits?.filter) {
        // Add a polaroid-style frame
        if (editorState.frameStyle === 'polaroid') {
          applyPolaroidFrame(ctx, canvas.width, canvas.height)
        }
        
        // Implement other frame styles here
      }
      
      // Add caption if present and not using the back side
      if (editorState.caption && (!editorState.backSide || !editorState.advancedEdits?.caption)) {
        ctx.filter = 'none'
        ctx.font = `${editorState.font === 'handwritten' ? 'cursive' : 
                      editorState.font === 'typewriter' ? 'monospace' : 'sans-serif'} 24px`
        ctx.fillStyle = 'black'
        ctx.textAlign = 'center'
        ctx.fillText(editorState.caption, canvas.width / 2, canvas.height - 30)
      }
      
      // Get the final image
      const frontDataUrl = canvas.toDataURL('image/png')
      
      // Download with our utility function
      await downloadMemoryCard(
        frontDataUrl, 
        editorState.backSide,
        `dreamframe-${Date.now()}`
      )
      
      toast.success(editorState.backSide 
        ? "Your memory frame has been downloaded (front and back sides)" 
        : "Your memory frame has been downloaded")
    }
    
    img.src = editorState.imageUrl
  }

  const handleReset = () => {
    setPhoto(null)
    setEditorState(null)
    setShowMintingPanel(false)
    setShowAdvancedEditor(false)
  }

  const handleSaveToGallery = () => {
    if (!editorState) return
    
    // In a real app, this would save to a database
    toast.success("Your memory frame has been saved to your gallery")
    
    // Navigate to gallery page
    router.push("/gallery")
  }

  const handleShowAdvancedEditor = () => {
    setShowAdvancedEditor(true)
  }

  const handleAdvancedEditorCancel = () => {
    setShowAdvancedEditor(false)
  }

  const handleAdvancedEditorSave = (editedImageUrl: string, metadata: any) => {
    if (editorState) {
      // Update the editor state with the edited image and metadata
      setEditorState({
        ...editorState,
        imageUrl: editedImageUrl,
        advancedEdits: metadata,
        // If the advanced editor applied a filter, update the filter state
        filter: metadata.filter || editorState.filter,
        // Use caption from the enhanced editor
        caption: metadata.caption || editorState.caption,
        // Store any back side data for flippable memory
        backSide: metadata.backSide || null
      })
    }
    
    setShowAdvancedEditor(false)
    toast.success("Advanced edits applied successfully!")
  }

  if (!photo) {
    return (
      <div 
        className={`w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          isDragging ? 'border-purple-500 bg-purple-50/10' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <div className="p-4 bg-purple-100/20 rounded-full">
            <ImageIcon className="h-10 w-10 text-purple-500" />
          </div>
          <h3 className="text-xl font-medium">Upload your memory photo</h3>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Drag and drop a photo here, or click to browse
          </p>
          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileInput} 
          />
        </div>
      </div>
    )
  }

  if (showAdvancedEditor && editorState) {
    return (
      <EnhancedPhotoEditor 
        imageUrl={editorState.imageUrl}
        onSave={handleAdvancedEditorSave}
        onCancel={handleAdvancedEditorCancel}
      />
    )
  }
  
  if (showMintingPanel && editorState) {
    return (
      <div className="space-y-8">
        <NFTMinting 
          imageUrl={editorState.imageUrl} 
          emotion={{
            primaryEmotion: editorState.filter, 
            emotionalTone: editorState.caption || "Memory"
          }} 
          onBack={() => setShowMintingPanel(false)}
        />
      </div>
    )
  }

  if (editorState) {
    // Array of filter presets
    const filters = [
      { id: 'original', name: 'Original' },
      { id: 'polaroid', name: 'Polaroid' },
      { id: 'vintage', name: 'Vintage' },
      { id: 'monochrome', name: 'Monochrome' },
      { id: 'pastel', name: 'Pastel' }
    ]

    // Frame styles
    const frames = [
      { id: 'none', name: 'None' },
      { id: 'polaroid', name: 'Polaroid' },
      { id: '35mm', name: '35mm Slide' },
      { id: 'instant', name: 'Retro Instant' }
    ]

    // Font styles
    const fonts = [
      { id: 'handwritten', name: 'Handwritten' },
      { id: 'typewriter', name: 'Typewriter' },
      { id: 'neon', name: 'Neon' }
    ]

    return (
      <div className="grid md:grid-cols-2 gap-8">
        {/* Preview Section */}
        <div className="flex items-center justify-center">
          <div className={`relative ${
            editorState.frameStyle === 'polaroid' ? 'p-3 pb-16 bg-white shadow-xl' :
            editorState.frameStyle === '35mm' ? 'p-1 border-4 border-black bg-gray-900' :
            editorState.frameStyle === 'instant' ? 'p-3 pt-12 pb-12 bg-white shadow-lg border border-gray-200' : ''
          }`}>
            <img 
              src={editorState.imageUrl} 
              alt="Memory photo" 
              className="max-w-full h-auto"
              style={{
                filter: 
                  editorState.filter === 'vintage' 
                    ? `sepia(${editorState.filterIntensity * 0.007}) contrast(${1 + editorState.filterIntensity * 0.001})` :
                  editorState.filter === 'monochrome'
                    ? `grayscale(${editorState.filterIntensity / 100})` :
                  editorState.filter === 'polaroid'
                    ? `contrast(${1 + editorState.filterIntensity * 0.003}) brightness(${1 + editorState.filterIntensity * 0.001}) saturate(${1 - editorState.filterIntensity * 0.002})` :
                  editorState.filter === 'pastel'
                    ? `brightness(${1 + editorState.filterIntensity * 0.001}) saturate(0.7) contrast(${1 - editorState.filterIntensity * 0.001})` :
                  'none'
              }}
            />
            {editorState.caption && (
              <div className={`absolute bottom-4 w-full text-center ${
                editorState.font === 'handwritten' ? 'font-serif italic' :
                editorState.font === 'typewriter' ? 'font-mono' :
                editorState.font === 'neon' ? 'font-bold text-white text-shadow' : 'font-sans'
              }`}>
                <p className="text-xl px-4">{editorState.caption}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Controls Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Customize Your Memory</h2>
            <Button
              onClick={handleShowAdvancedEditor}
              variant="outline"
              className="flex items-center gap-1"
            >
              <Wand2 className="h-4 w-4" />
              <span>Advanced Editor</span>
            </Button>
          </div>
          
          {/* Filter Presets */}
          <div>
            <Label className="block mb-2">Filter Style</Label>
            <div className="flex flex-wrap gap-2">
              {filters.map(filter => (
                <Button
                  key={filter.id}
                  variant={editorState.filter === filter.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange(filter.id)}
                >
                  {filter.name}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Filter Intensity */}
          <div>
            <Label className="block mb-2">
              Intensity: {editorState.filterIntensity}%
            </Label>
            <input
              type="range"
              min="0"
              max="100"
              value={editorState.filterIntensity}
              onChange={(e) => handleIntensityChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          {/* Frame Styles */}
          <div>
            <Label className="block mb-2">Frame Style</Label>
            <div className="flex flex-wrap gap-2">
              {frames.map(frame => (
                <Button
                  key={frame.id}
                  variant={editorState.frameStyle === frame.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFrameChange(frame.id)}
                >
                  {frame.name}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Text Caption */}
          <div>
            <Label htmlFor="caption" className="block mb-2">Caption</Label>
            <input
              id="caption"
              type="text"
              placeholder="Add a caption to your memory..."
              value={editorState.caption}
              onChange={(e) => handleCaptionChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md"
            />
          </div>
          
          {/* Font Style */}
          <div>
            <Label className="block mb-2">Font Style</Label>
            <div className="flex flex-wrap gap-2">
              {fonts.map(font => (
                <Button
                  key={font.id}
                  variant={editorState.font === font.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFontChange(font.id)}
                >
                  {font.name}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Advanced Edit Indicator */}
          {editorState.advancedEdits && (
            <div className="text-sm bg-purple-50 dark:bg-purple-900/20 p-2 rounded-md">
              <p className="font-medium text-purple-700 dark:text-purple-300">
                Advanced edits applied
                {editorState.advancedEdits.autoEnhanced ? ' • AI enhanced' : ''}
              </p>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4">
            <Button
              onClick={handleDownload}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Download
            </Button>
            <Button
              onClick={() => setShowMintingPanel(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Mint as NFT
            </Button>
            <Button
              onClick={handleSaveToGallery}
              variant="outline"
            >
              Save to Gallery
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
            >
              Upload New Photo
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
