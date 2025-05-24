import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { 
    isFlippable?: boolean; 
    isFlipped?: boolean;
    onFlip?: () => void;
  }
>(({ className, isFlippable, isFlipped, onFlip, ...props }, ref) => {
  if (isFlippable) {
    return (
      <div 
        className={cn(
          "memory-card-container relative w-full transition-all duration-300",
          isFlipped ? "flipped" : "",
          className
        )}
        style={{ perspective: '1000px' }}
        onClick={onFlip}
        ref={ref}
        {...props}
      >
        <div 
          className="memory-card w-full h-full relative transition-transform duration-700" 
          style={{ transformStyle: 'preserve-3d' }}
        >
          {props.children}
        </div>
        <style jsx>{`
          .flipped .memory-card {
            transform: rotateY(180deg);
          }
        `}</style>
      </div>
    )
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

const CardFront = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute w-full h-full backface-hidden",
      className
    )}
    style={{ 
      backfaceVisibility: 'hidden',
      transform: 'rotateY(0deg)'
    }}
    {...props}
  />
))
CardFront.displayName = "CardFront"

const CardBack = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute w-full h-full backface-hidden",
      className
    )}
    style={{ 
      backfaceVisibility: 'hidden',
      transform: 'rotateY(180deg)'
    }}
    {...props}
  />
))
CardBack.displayName = "CardBack"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardFront, CardBack }
