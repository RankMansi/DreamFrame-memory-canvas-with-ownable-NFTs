export async function uploadToIPFS(imageFile: File, metadata: any): Promise<string> {
    const formData = new FormData();
    formData.append("file", imageFile);
  
    const imageUpload = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
      },
      body: formData,
    });
  
    const imageData = await imageUpload.json();
    const imageHash = imageData.IpfsHash;
  
    const metadataUpload = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
      },
      body: JSON.stringify({
        ...metadata,
        image: `ipfs://${imageHash}`,
      }),
    });
  
    const metadataData = await metadataUpload.json();
    return `ipfs://${metadataData.IpfsHash}`;
  }
  