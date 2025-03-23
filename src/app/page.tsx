"use client";

import { useState, useEffect } from "react";
import InputSection from "@/components/InputSection";
import OptionsSection from "@/components/OptionsSection";
import OutputSection from "@/components/OutputSection";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [encodedText, setEncodedText] = useState("");
  const [isImage, setIsImage] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [decodedImagePreview, setDecodedImagePreview] = useState<string | null>(
    null
  );
  const [documentName, setDocumentName] = useState("encoded-data");
  const [originalFileName, setOriginalFileName] = useState<string | null>(null);
  const [isBase64Image, setIsBase64Image] = useState(false);
  const [imageType, setImageType] = useState("jpg");

  useEffect(() => {
    if (originalFileName) {
      const baseName = originalFileName.split(".")[0];
      setDocumentName(`encoded-${baseName}`);
    } else {
      setDocumentName("encoded-data");
    }
  }, [originalFileName]);

  const handleEncode = (encodedContent: string) => {
    setEncodedText(encodedContent);
  };

  const handleFileNameChange = (name: string | null) => {
    setOriginalFileName(name);
    setIsFileUploaded(!!name);
  };

  // Detect if input is a Base64 image and decode it instantly
  const checkBase64Image = (text: string) => {
    try {
      if (!text || text.length < 100) return false; // Too short to be a valid image base64

      const cleanInput = text.replace(/\s/g, "");
      const decoded = atob(cleanInput.replace(/-/g, "+").replace(/_/g, "/"));
      const byteArray = new Uint8Array(decoded.length);
      for (let i = 0; i < decoded.length; i++) {
        byteArray[i] = decoded.charCodeAt(i);
      }

      const isPNG =
        byteArray[0] === 0x89 &&
        byteArray[1] === 0x50 &&
        byteArray[2] === 0x4e &&
        byteArray[3] === 0x47;
      const isJPEG = byteArray[0] === 0xff && byteArray[1] === 0xd8;
      const isGIF =
        byteArray[0] === 0x47 && byteArray[1] === 0x49 && byteArray[2] === 0x46;

      if (isPNG || isJPEG || isGIF) {
        const imageFormat = isPNG ? "png" : isJPEG ? "jpeg" : "gif";
        setImageType(imageFormat);
        const dataUrl = `data:image/${imageFormat};base64,${cleanInput}`;
        setDecodedImagePreview(dataUrl);
        setIsBase64Image(true);
        return true;
      }
      setIsBase64Image(false);
      setDecodedImagePreview(null);
      return false;
    } catch (error) {
      setIsBase64Image(false);
      setDecodedImagePreview(null);
      return false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="flex-1 p-10 flex items-center justify-center">
        <div className="max-w-5xl w-full space-y-10">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">Base64 Encoder</h1>
            <ThemeToggle />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <InputSection
              setInputText={setInputText}
              setIsImage={setIsImage}
              setImagePreview={setImagePreview}
              onFileNameChange={handleFileNameChange}
              checkBase64Image={checkBase64Image}
              isBase64Image={isBase64Image}
            />
            <div className="space-y-10">
              <OptionsSection
                onEncode={handleEncode}
                inputText={inputText}
                isImage={isImage}
                isBase64Image={isBase64Image}
                isFileUploaded={isFileUploaded}
              />
              <OutputSection
                encodedText={encodedText}
                decodedImagePreview={decodedImagePreview}
                documentName={documentName}
                isImage={isImage}
                imageType={
                  isBase64Image
                    ? imageType
                    : originalFileName?.split(".").pop() || "jpg"
                }
              />
            </div>
          </div>
        </div>
      </div>
      <footer className="flex items-center justify-center py-4 bg-muted text-muted-foreground border-t border-border">
        <p className="text-base">
          © {new Date().getFullYear()} Base64 Encoder. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
