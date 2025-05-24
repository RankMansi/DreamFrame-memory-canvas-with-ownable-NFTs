"use client";

import { useEffect, useState } from "react";

export default function ApiTestPage() {
  const [apiStatus, setApiStatus] = useState("Checking...");

  useEffect(() => {
    // This will show in browser - only for development
    console.log("API key status:", process.env.NEXT_PUBLIC_REPLICATE_API_KEY_CHECK);
    setApiStatus(process.env.NEXT_PUBLIC_REPLICATE_API_KEY_CHECK || "NOT FOUND");
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">API Configuration Test</h1>
      <div className="p-4 border rounded-md">
        <p><strong>Replicate API Key Status:</strong> {apiStatus}</p>
        <p className="mt-4 text-sm text-muted-foreground">
          If you see "CONFIGURED", your API key is properly set up.<br />
          If you see "MISSING", check your .env.local file.
        </p>
      </div>
    </div>
  );
} 