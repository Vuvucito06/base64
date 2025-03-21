// src/components/OutputSection.tsx
"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";
import { Copy, Download, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OutputSection({
  encodedText,
}: {
  encodedText: string;
}) {
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const copyToClipboard = async () => {
    if (!encodedText) return;
    await navigator.clipboard.writeText(encodedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1200); // 1.2 seconds
  };

  const downloadFile = () => {
    if (!encodedText) return;
    setIsDownloading(true);
    const blob = new Blob([encodedText], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "encoded.txt");
    setTimeout(() => setIsDownloading(false), 1000); // Simulate download duration
  };

  return (
    <div className="p-6 bg-card rounded-xl shadow-md border border-border">
      <h2 className="text-xl font-semibold mb-4 text-card-foreground">
        Encoded Output
      </h2>
      <Textarea
        className="w-full bg-secondary border-border font-mono text-sm text-foreground resize-none focus:ring-2 focus:ring-primary min-h-[200px]"
        rows={8}
        placeholder="Your encoded text will appear here..."
        value={encodedText}
        readOnly
      />
      <div className="flex space-x-3 mt-4">
        <Button
          className={cn(
            "flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 rounded-lg",
            "transition-all duration-300",
            isCopied && "bg-primary/80 scale-105",
            "active:scale-95",
            !encodedText && "opacity-50 cursor-not-allowed"
          )}
          onClick={copyToClipboard}
          disabled={!encodedText}
        >
          {isCopied ? (
            <Check className="h-5 w-5 animate-bounce" />
          ) : (
            <Copy className="h-5 w-5 animate-pulse" />
          )}
          <span>{isCopied ? "Copied!" : "Copy"}</span>
        </Button>
        <Button
          className={cn(
            "flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 rounded-lg",
            "transition-all duration-300",
            isDownloading && "bg-primary/80 scale-105",
            "active:scale-95",
            !encodedText && "opacity-50 cursor-not-allowed"
          )}
          onClick={downloadFile}
          disabled={!encodedText}
        >
          {isDownloading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Download className="h-5 w-5 animate-pulse" />
          )}
          <span>{isDownloading ? "Downloading..." : "Download"}</span>
        </Button>
      </div>
    </div>
  );
}
