"use client"

// This is a component to ensure CSS is being loaded correctly
export default function ForceCSS() {
  return (
    <div className="hidden">
      <div className="text-red-500 bg-blue-500 border-green-500 rounded-lg p-4 m-2 flex items-center justify-center">
        This element forces CSS loading
      </div>
    </div>
  )
} 