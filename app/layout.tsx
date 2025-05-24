import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "DreamFrame | Memory Photo Aesthetic & NFT Minting",
  description: "Transform your cherished photos with beautiful filters and frames. Mint them as unique NFTs to preserve your memories forever.",
  keywords: "photo editing, memory frame, NFT minting, aesthetic photos, polaroid, vintage filters",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
