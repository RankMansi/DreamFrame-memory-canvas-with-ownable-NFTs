import { type NextRequest, NextResponse } from "next/server"
import { getMetadata } from "@/lib/metadata-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const metadata = getMetadata(id)

  if (!metadata) {
    return NextResponse.json({ error: "Metadata not found" }, { status: 404 })
  }

  return NextResponse.json(metadata)
}
