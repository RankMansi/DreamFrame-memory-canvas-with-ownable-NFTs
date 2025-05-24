import Link from "next/link"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"

export default function Navbar() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-purple-500" />
          <span className="font-bold text-xl">DreamFrame</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/create" className="text-muted-foreground hover:text-foreground transition-colors">
            Create
          </Link>
          <Link href="/gallery" className="text-muted-foreground hover:text-foreground transition-colors">
            Gallery
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <ModeToggle />
          <Link href="/create">
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              Create Art
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
