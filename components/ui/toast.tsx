"use client"

import { Toaster as SonnerToaster } from "sonner"

export { toast } from "sonner"

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        className: "rounded-md border px-4 py-3 shadow-lg",
        duration: 3000,
      }}
    />
  )
}
