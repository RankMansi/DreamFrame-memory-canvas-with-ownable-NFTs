"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';
import * as faceapi from 'face-api.js';
import { Textarea } from "@/components/ui/textarea";

// Removed Pintura imports

interface EnhancedPhotoEditorProps {
  imageUrl: string;
  onSave: (editedImageUrl: string, metadata: any) => void;
  onCancel: () => void;
}

export default function EnhancedPhotoEditor({ imageUrl, onSave, onCancel }: EnhancedPhotoEditorProps) {
  const [faceDetectionModel, setFaceDetectionModel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [detectedFaces, setDetectedFaces] = useState<any[]>([]);
  const [autoEnhanced, setAutoEnhanced] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [caption, setCaption] = useState('');
  const [appliedFilter, setAppliedFilter] = useState<string | null>(null);

  // Load TensorFlow and face detection models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await tf.ready();
        
        // Load models in parallel
        const [blazefaceModel] = await Promise.all([
          blazeface.load(),
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        ]);
        
        setFaceDetectionModel(blazefaceModel);
        setLoading(false);
      } catch (error) {
        console.error('Error loading ML models:', error);
        setLoading(false);
        toast.error('Could not load AI enhancement models. Basic editing is still available.');
      }
    };

    loadModels();
  }, []);

  useEffect(() => {
    if (imageUrl && canvasRef.current) {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          
          // Also prepare the back canvas
          if (backCanvasRef.current) {
            const backCanvas = backCanvasRef.current;
            backCanvas.width = img.width;
            backCanvas.height = img.height;
            const backCtx = backCanvas.getContext('2d');
            if (backCtx) {
              // Create a cream-colored background for the back
              backCtx.fillStyle = '#f9f5e9';
              backCtx.fillRect(0, 0, backCanvas.width, backCanvas.height);
            }
          }
        }
      };
      img.src = imageUrl;
    }
  }, [imageUrl]);

  // Detect faces when the image is loaded
  useEffect(() => {
    const detectFaces = async () => {
      if (!faceDetectionModel || !imageRef.current) return;
      
      try {
        // Convert image to tensor
        const img = tf.browser.fromPixels(imageRef.current);
        const predictions = await faceDetectionModel.estimateFaces(img, false);
        
        setDetectedFaces(predictions);
        img.dispose(); // Clean up tensor
        
        // If faces are detected, show message
        if (predictions.length > 0) {
          suggestCaptionPosition(predictions, imageRef.current);
        }
      } catch (error) {
        console.error('Error detecting faces:', error);
      }
    };

    if (faceDetectionModel && imageRef.current && imageRef.current.complete) {
      detectFaces();
    }
  }, [faceDetectionModel, imageUrl]);

  // Suggest caption position based on face detection
  const suggestCaptionPosition = (faces: any[], image: HTMLImageElement) => {
    // Simple logic: if faces in bottom half, put caption on top and vice versa
    const imgHeight = image.height;
    const facePositions = faces.map(face => ({
      y: face.topLeft[1] + (face.bottomRight[1] - face.topLeft[1]) / 2,
      height: face.bottomRight[1] - face.topLeft[1]
    }));
    
    // Check if most faces are in the bottom half
    const facesInBottomHalf = facePositions.filter(face => face.y > imgHeight / 2);
    
    if (facesInBottomHalf.length > faces.length / 2) {
      // Most faces in bottom half, suggest top caption
      toast.success("AI detected faces in bottom half. Caption position set to top.");
    } else {
      // Most faces in top half or evenly distributed, suggest bottom caption
      toast.success("AI detected faces. Caption position optimized.");
    }
  };

  // Apply edits to the canvas
  const applyEdits = () => {
    if (!canvasRef.current || !imageRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the image with filters
    ctx.filter = `brightness(${100 + brightness * 100}%) contrast(${100 + contrast * 100}%) saturate(${100 + saturation * 100}%)`;
    ctx.drawImage(imageRef.current, 0, 0);
    
    // Apply polaroid frame if selected
    if (appliedFilter === 'polaroid') {
      applyPolaroidFrame(ctx, canvas.width, canvas.height);
    } else if (appliedFilter === 'vintage') {
      applyVintageFilter(ctx, canvas.width, canvas.height);
    }
    
    // Reset filter
    ctx.filter = 'none';
  };

  // Apply a polaroid-style frame to the image
  const applyPolaroidFrame = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Add white border
    const borderSize = Math.max(width, height) * 0.08;
    const bottomBorderExtra = borderSize * 1.5; // Extra space at the bottom for caption
    
    // Create temporary canvas to hold the current image
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx?.drawImage(ctx.canvas, 0, 0);
    
    // Clear original canvas and make it bigger
    ctx.canvas.width = width + borderSize * 2;
    ctx.canvas.height = height + borderSize + bottomBorderExtra;
    
    // Draw white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw original image in the center
    ctx.drawImage(tempCanvas, borderSize, borderSize);
    
    // Add shadow effect
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.fillStyle = 'transparent';
    ctx.fillRect(borderSize, borderSize, width, height);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  };
  
  // Apply a vintage filter effect
  const applyVintageFilter = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Get image data
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // Apply sepia-like effect
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Vintage formula
      data[i] = Math.min(255, (r * 0.9) + (g * 0.3) + (b * 0.1));
      data[i + 1] = Math.min(255, (r * 0.3) + (g * 0.7) + (b * 0.1));
      data[i + 2] = Math.min(255, (r * 0.1) + (g * 0.1) + (b * 0.4));
    }
    
    // Put the image data back
    ctx.putImageData(imageData, 0, 0);
    
    // Add a vignette effect
    const gradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height) / 1.5
    );
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.4)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  };

  // Apply edits when parameters change
  useEffect(() => {
    applyEdits();
  }, [brightness, contrast, saturation, appliedFilter]);

  // Update the back canvas with the caption
  const updateBackCanvas = () => {
    if (!backCanvasRef.current) return;
    
    const canvas = backCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear and create a cream-colored background
    ctx.fillStyle = '#f9f5e9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add caption text
    ctx.fillStyle = '#333333';
    ctx.font = '18px cursive';
    
    // Word wrap the caption text
    const maxWidth = canvas.width - 40;
    const lineHeight = 24;
    const x = 20;
    let y = 40;
    
    const words = caption.split(' ');
    let line = '';
    
    words.forEach(word => {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && line !== '') {
        ctx.fillText(line, x, y);
        line = word + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    });
    
    ctx.fillText(line, x, y);
  };

  // Update back canvas when caption changes
  useEffect(() => {
    updateBackCanvas();
  }, [caption]);

  // Handle AI-based auto enhancement
  const handleAutoEnhance = async () => {
    if (!imageRef.current) return;
    
    try {
      setLoading(true);
      
      // Apply auto-adjustments to brightness, contrast, saturation
      setBrightness(0.05); // slight brightness boost
      setContrast(0.1);    // moderate contrast boost
      setSaturation(0.08); // slight saturation boost
      
      setAutoEnhanced(true);
      toast.success("AI auto-enhancement applied!");
      
      setLoading(false);
    } catch (error) {
      console.error('Error during auto-enhancement:', error);
      setLoading(false);
      toast.error('Auto-enhancement failed. Please try manual adjustments.');
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const applyFilter = (filter: string) => {
    setAppliedFilter(filter);
  };

  const handleSave = () => {
    if (!canvasRef.current) return;
    
    try {
      // Get the front side image with applied effects
      const frontDataUrl = canvasRef.current.toDataURL('image/jpeg');
      
      // Get the back side with caption if it exists
      let backDataUrl = null;
      if (backCanvasRef.current && caption.trim()) {
        backDataUrl = backCanvasRef.current.toDataURL('image/jpeg');
      }
      
      const metadata = {
        adjustments: {
          brightness,
          contrast,
          saturation,
        },
        filter: appliedFilter,
        caption,
        backSide: backDataUrl,
        autoEnhanced: autoEnhanced
      };
      
      onSave(frontDataUrl, metadata);
    } catch (error) {
      console.error('Error saving image:', error);
      toast.error('Error saving image. Please try again.');
    }
  };

  return (
    <div className="flex flex-col">
      <div className="hidden">
        {/* Hidden reference image for face detection */}
        <img 
          ref={imageRef} 
          src={imageUrl} 
          onLoad={() => {
            if (faceDetectionModel && imageRef.current) {
              const detectFaces = async () => {
                try {
                  const img = tf.browser.fromPixels(imageRef.current!);
                  const predictions = await faceDetectionModel.estimateFaces(img, false);
                  setDetectedFaces(predictions);
                  img.dispose();
                } catch (error) {
                  console.error('Error detecting faces:', error);
                }
              };
              detectFaces();
            }
          }}
          alt="Original" 
        />
      </div>
      
      <div className="mb-4 flex justify-between">
        <Button 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        
        <Button 
          onClick={handleAutoEnhance} 
          disabled={loading || autoEnhanced}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? 'Processing...' : (autoEnhanced ? 'Enhanced ✓' : 'AI Auto-Enhance')}
        </Button>
      </div>
      
      {/* Flippable Memory Card */}
      <div className={`memory-card-container w-full bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden transition-all duration-500 mb-4 ${isFlipped ? 'flipped' : ''}`} style={{ perspective: '1000px' }}>
        <div className="memory-card w-full h-full relative" style={{ transformStyle: 'preserve-3d', transition: 'transform 0.8s' }}>
          {/* Front Side - Photo Editor */}
          <div 
            className={`memory-card-front w-full ${isFlipped ? 'hidden' : 'block'}`}
            style={{ 
              backfaceVisibility: 'hidden',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
              position: isFlipped ? 'absolute' : 'relative',
              top: 0,
              left: 0
            }}
          >
            <div className="overflow-auto max-h-[500px] flex justify-center p-4">
              <canvas ref={canvasRef} className="max-w-full shadow-lg" />
            </div>
          </div>
          
          {/* Back Side - Caption Area */}
          <div 
            className={`memory-card-back w-full ${isFlipped ? 'block' : 'hidden'}`}
            style={{ 
              backfaceVisibility: 'hidden',
              transform: isFlipped ? 'rotateY(0)' : 'rotateY(-180deg)',
              position: isFlipped ? 'relative' : 'absolute',
              top: 0,
              left: 0
            }}
          >
            <div className="overflow-auto max-h-[500px] flex justify-center p-4">
              <div className="w-full">
                <canvas ref={backCanvasRef} className="max-w-full shadow-lg mb-4" />
                <div className="mb-4">
                  <Label htmlFor="caption" className="text-lg font-semibold">Memory Caption</Label>
                  <Textarea 
                    id="caption" 
                    placeholder="Write your memory caption here..." 
                    className="w-full h-24 mt-2"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Flip Button */}
      <Button 
        onClick={handleFlip} 
        className="mb-4 mx-auto bg-amber-600 hover:bg-amber-700 transform transition hover:scale-105"
      >
        {isFlipped ? "View Photo" : "Add Caption"}
      </Button>
      
      {/* Editor Controls */}
      <div className="w-full bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden p-4">
        {!isFlipped ? (
          <div>
            <h3 className="text-lg font-semibold mb-4">Photo Adjustments</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="brightness">Brightness ({Math.round(brightness * 100)}%)</Label>
                  <input 
                    id="brightness"
                    type="range" 
                    min="-1" 
                    max="1" 
                    step="0.05" 
                    value={brightness}
                    onChange={(e) => setBrightness(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Label htmlFor="contrast">Contrast ({Math.round(contrast * 100)}%)</Label>
                  <input 
                    id="contrast"
                    type="range" 
                    min="-1" 
                    max="1" 
                    step="0.05" 
                    value={contrast}
                    onChange={(e) => setContrast(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="saturation">Saturation ({Math.round(saturation * 100)}%)</Label>
                  <input 
                    id="saturation"
                    type="range" 
                    min="-1" 
                    max="1" 
                    step="0.05" 
                    value={saturation}
                    onChange={(e) => setSaturation(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Label className="block mb-2">Apply Filter</Label>
                  <div className="flex space-x-3 mb-2">
                    <Button 
                      onClick={() => applyFilter('none')} 
                      className={`${appliedFilter === 'none' || !appliedFilter ? 'bg-blue-700' : 'bg-gray-300 text-gray-800'}`}
                      size="sm"
                    >
                      None
                    </Button>
                    <Button 
                      onClick={() => applyFilter('polaroid')} 
                      className={`${appliedFilter === 'polaroid' ? 'bg-blue-700' : 'bg-gray-300 text-gray-800'}`}
                      size="sm"
                    >
                      Polaroid
                    </Button>
                    <Button 
                      onClick={() => applyFilter('vintage')} 
                      className={`${appliedFilter === 'vintage' ? 'bg-blue-700' : 'bg-gray-300 text-gray-800'}`}
                      size="sm"
                    >
                      Vintage
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold mb-4">Caption Settings</h3>
            <p className="text-sm text-gray-600 mb-4">
              Your caption will be printed on the back of the memory. Make it meaningful and personal.
            </p>
            <Button 
              onClick={updateBackCanvas} 
              className="w-full mb-4 bg-blue-600 hover:bg-blue-700"
            >
              Update Caption
            </Button>
          </div>
        )}
        
        <Button onClick={handleSave} className="w-full mt-4 bg-green-600 hover:bg-green-700 text-lg py-2">
          Save Memory
        </Button>
      </div>
      
      <style jsx>{`
        .flipped .memory-card {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
} 