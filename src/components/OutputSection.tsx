"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";
import {
  Copy,
  Download,
  Check,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
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
    <div className="bg-card border-border rounded-xl border p-6 shadow-md">
      <h2 className="text-card-foreground mb-4 text-xl font-semibold">
        Output
      </h2>

      {decodedImagePreview ? (
        <div className="bg-secondary border-border mb-4 flex min-h-[200px] w-full items-center justify-center rounded-md border p-4">
          <img
            src={decodedImagePreview}
            alt="Decoded"
            className="max-h-[300px] max-w-full object-contain"
          />
        </div>
      ) : isImage ? (
        <div className="bg-secondary border-border mb-4 flex min-h-[200px] w-full flex-col items-center justify-center rounded-md border p-4">
          <p className="text-muted-foreground">Image encoded to Base64</p>
          {isDownloadReady && (
            <p className="mt-2 text-green-600">Ready to download</p>
          )}
        </div>
      ) : (
        <div className="relative min-h-[200px] w-full">
          <Textarea
            className="bg-secondary border-border text-foreground focus:ring-primary min-h-[200px] w-full resize-none font-mono text-sm focus:ring-2"
            rows={8}
            placeholder="Your encoded text will appear here..."
            value={encodedText}
            readOnly
          />
          {isDownloadReady && (
            <p className="absolute right-2 bottom-2 text-sm text-green-600">
              Ready to download
            </p>
          )}
        </div>
      )}

      <div className="mt-4 flex space-x-3">
        {!isImage && !decodedImagePreview && encodedText && (
          <Button
            className={cn(
              "bg-primary hover:bg-primary/90 text-primary-foreground flex items-center space-x-2 rounded-lg py-2 font-medium",
              "transition-all duration-300",
              isCopied && "bg-primary/80 scale-105",
              "active:scale-95",
              !encodedText && "cursor-not-allowed opacity-50",
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
            "bg-primary hover:bg-primary/90 text-primary-foreground flex items-center space-x-2 rounded-lg py-2 font-medium",
            "transition-all duration-300",
            isDownloading && "bg-primary/80 scale-105",
            "active:scale-95",
            !isDownloadReady && "cursor-not-allowed opacity-50",
          )}
          onClick={downloadFile}
          disabled={!isDownloadReady}
        >
          {isDownloading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : decodedImagePreview ? (
            <ImageIcon className="h-5 w-5 animate-pulse" />
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
