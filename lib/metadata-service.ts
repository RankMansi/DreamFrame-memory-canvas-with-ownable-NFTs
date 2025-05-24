interface Attribute {
  trait_type: string;
  value: string;
}

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Attribute[];
}

const metadataStore: Record<string, NFTMetadata> = {}

export const storeMetadata = (
  imageUrl: string, 
  name: string, 
  description: string, 
  attributes: Attribute[] = []
) => {
  const id = Date.now().toString()
  const metadata: NFTMetadata = {
    name,
    description,
    image: imageUrl,
    attributes: attributes,
  }

  metadataStore[id] = metadata
  return id
}

export const getMetadata = (id: string) => {
  return metadataStore[id] || null
}

export const createTokenURI = (
  imageUrl: string, 
  name: string, 
  description: string, 
  attributes: Attribute[] = []
) => {
  const id = storeMetadata(imageUrl, name, description, attributes)

  // In a real app, this would be a URL to IPFS or a server
  // For our local demo, we'll use a local URL
  return `/api/metadata/${id}`
}
