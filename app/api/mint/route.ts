import { type NextRequest, NextResponse } from "next/server"
import { createTokenURI } from "@/lib/metadata-service"

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, name, description, attributes } = await req.json()

    if (!imageUrl || !name) {
      return NextResponse.json({ error: "Image URL and name are required" }, { status: 400 })
    }

    // Create token URI (metadata)
    const tokenURI = createTokenURI(imageUrl, name, description || "", attributes || [])

    return NextResponse.json({ tokenURI })
  } catch (error) {
    console.error("Error creating metadata:", error)
    return NextResponse.json({ error: "Failed to create metadata" }, { status: 500 })
  }
}
