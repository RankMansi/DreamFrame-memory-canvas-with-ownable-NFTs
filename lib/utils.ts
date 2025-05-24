import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Downloads memory card images (front and optionally back side)
 * @param frontImageUrl URL or data URL of the front side image
 * @param backImageUrl Optional URL or data URL of the back side image
 * @param prefix Filename prefix for the downloaded files
 */
export async function downloadMemoryCard(
  frontImageUrl: string, 
  backImageUrl?: string | null,
  prefix: string = 'dreamframe'
): Promise<void> {
  // Download front side
  const frontLink = document.createElement('a')
  frontLink.download = `${prefix}-front.png`
  frontLink.href = frontImageUrl
  
  // If we have a back side, download it as well
  if (backImageUrl) {
    // Create a second link for the back side
    const backLink = document.createElement('a')
    backLink.download = `${prefix}-back.png`
    backLink.href = backImageUrl
    
    // Download front first, then back
    frontLink.click()
    
    // Slight delay to prevent browser issues
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Download back side
    backLink.click()
    
    return
  }
  
  // Just download the front side
  frontLink.click()
}

/**
 * Applies a Polaroid-style frame to a canvas
 * @param ctx Canvas rendering context
 * @param width Original image width
 * @param height Original image height
 * @returns New dimensions {width, height} of the canvas
 */
export function applyPolaroidFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): {width: number, height: number} {
  // Create temporary canvas to hold the current image
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = width
  tempCanvas.height = height
  const tempCtx = tempCanvas.getContext('2d')
  tempCtx?.drawImage(ctx.canvas, 0, 0)
  
  // Calculate border size
  const borderSize = Math.max(width, height) * 0.08
  const bottomBorderExtra = borderSize * 1.5 // Extra space at bottom for caption
  
  // Calculate new dimensions
  const newWidth = width + borderSize * 2
  const newHeight = height + borderSize + bottomBorderExtra
  
  // Resize the canvas
  ctx.canvas.width = newWidth
  ctx.canvas.height = newHeight
  
  // Draw white background
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, newWidth, newHeight)
  
  // Draw original image in the center
  ctx.drawImage(tempCanvas, borderSize, borderSize)
  
  // Add shadow effect
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
  ctx.shadowBlur = 15
  ctx.shadowOffsetX = 5
  ctx.shadowOffsetY = 5
  ctx.fillStyle = 'transparent'
  ctx.fillRect(borderSize, borderSize, width, height)
  
  // Reset shadow
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
  
  return { width: newWidth, height: newHeight }
}

/**
 * Applies a vintage filter effect to a canvas
 * @param ctx Canvas rendering context
 * @param width Image width
 * @param height Image height 
 */
export function applyVintageFilter(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  // Get image data
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data
  
  // Apply sepia-like effect
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    
    // Vintage formula
    data[i] = Math.min(255, (r * 0.9) + (g * 0.3) + (b * 0.1))
    data[i + 1] = Math.min(255, (r * 0.3) + (g * 0.7) + (b * 0.1))
    data[i + 2] = Math.min(255, (r * 0.1) + (g * 0.1) + (b * 0.4))
  }
  
  // Put the image data back
  ctx.putImageData(imageData, 0, 0)
  
  // Add vignette effect
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, 0,
    width / 2, height / 2, Math.max(width, height) / 1.5
  )
  gradient.addColorStop(0, 'rgba(0,0,0,0)')
  gradient.addColorStop(1, 'rgba(0,0,0,0.4)')
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
}