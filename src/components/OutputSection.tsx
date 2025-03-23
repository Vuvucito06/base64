"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";
import { Copy, Download, Check, Loader2, Image } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OutputSection({
  encodedText,
  decodedImagePreview,
  documentName,
  isImage,
  imageType,
}: {
  encodedText: string;
  decodedImagePreview: string | null;
  documentName: string;
  isImage: boolean;
  imageType: string;
}) {
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const copyToClipboard = async () => {
    if (!encodedText) return;
    try {
      await navigator.clipboard.writeText(encodedText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1200);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const downloadFile = () => {
    if (!encodedText && !decodedImagePreview) return;

    setIsDownloading(true);

    try {
      if (decodedImagePreview) {
        // Handle base64 image downloading - use correct extension based on image type
        fetch(decodedImagePreview)
          .then((res) => res.blob())
          .then((blob) => {
            // Use detected image type (from the MIME type check)
            saveAs(blob, `${documentName}.${imageType}`);
            setTimeout(() => setIsDownloading(false), 1000);
          });
      } else if (isImage && encodedText) {
        // Download encoded image as text file
        const filename = `${documentName}-encoded.txt`;
        const blob = new Blob([encodedText], {
          type: "text/plain;charset=utf-8",
        });
        saveAs(blob, filename);
        setTimeout(() => setIsDownloading(false), 1000);
      } else if (encodedText) {
        // Download encoded text as text file
        const filename = `${documentName}.txt`;
        const blob = new Blob([encodedText], {
          type: "text/plain;charset=utf-8",
        });
        saveAs(blob, filename);
        setTimeout(() => setIsDownloading(false), 1000);
      }
    } catch (error) {
      console.error("Error during download:", error);
      setIsDownloading(false);
    }
  };

  const isDownloadReady = encodedText || decodedImagePreview;

  return (
    <div className="p-6 bg-card rounded-xl shadow-md border border-border">
      <h2 className="text-xl font-semibold mb-4 text-card-foreground">
        Output
      </h2>

      {decodedImagePreview ? (
        <div className="w-full flex items-center justify-center bg-secondary border border-border rounded-md p-4 mb-4 min-h-[200px]">
          <img
            src={decodedImagePreview}
            alt="Decoded"
            className="max-w-full max-h-[300px] object-contain"
          />
        </div>
      ) : isImage ? (
        <div className="w-full flex flex-col items-center justify-center bg-secondary border border-border rounded-md p-4 mb-4 min-h-[200px]">
          <p className="text-muted-foreground">Image encoded to Base64</p>
          {isDownloadReady && (
            <p className="text-green-600 mt-2">Ready to download</p>
          )}
        </div>
      ) : (
        <div className="relative w-full min-h-[200px]">
          <Textarea
            className="w-full bg-secondary border-border font-mono text-sm text-foreground resize-none focus:ring-2 focus:ring-primary min-h-[200px]"
            rows={8}
            placeholder="Your encoded text will appear here..."
            value={encodedText}
            readOnly
          />
          {isDownloadReady && (
            <p className="absolute bottom-2 right-2 text-green-600 text-sm">
              Ready to download
            </p>
          )}
        </div>
      )}

      <div className="flex space-x-3 mt-4">
        {!isImage && !decodedImagePreview && encodedText && (
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
        )}

        <Button
          className={cn(
            "flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 rounded-lg",
            "transition-all duration-300",
            isDownloading && "bg-primary/80 scale-105",
            "active:scale-95",
            !isDownloadReady && "opacity-50 cursor-not-allowed"
          )}
          onClick={downloadFile}
          disabled={!isDownloadReady}
        >
          {isDownloading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : decodedImagePreview ? (
            <Image className="h-5 w-5 animate-pulse" />
          ) : (
            <Download className="h-5 w-5 animate-pulse" />
          )}
          <span>
            {isDownloading
              ? "Downloading..."
              : decodedImagePreview
              ? `Download Image (.${imageType})`
              : isImage
              ? "Download Base64"
              : "Download"}
          </span>
        </Button>
      </div>
    </div>
  );
}
