"use client";

import { useState, useEffect } from "react";
import InputSection from "@/components/InputSection";
import OptionsSection from "@/components/OptionsSection";
import OutputSection from "@/components/OutputSection";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useDebouncedCallback } from "use-debounce";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [encodedText, setEncodedText] = useState("");
  const [isImage, setIsImage] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const setImagePreview = useState<string | null>(null)[1];
  const [decodedImagePreview, setDecodedImagePreview] = useState<string | null>(
    null,
  );
  const [documentName, setDocumentName] = useState("encoded-data");
  const [originalFileName, setOriginalFileName] = useState<string | null>(null);
  const [isBase64Image, setIsBase64Image] = useState(false);
  const [imageType, setImageType] = useState("jpg");

  const changeInputText = useDebouncedCallback(
    (value: string) => setInputText(value),
    1000,
  );

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

  const resetDecodedState = () => {
    setDecodedImagePreview(null);
    setIsBase64Image(false);
    setImageType("jpg"); // Reset to default image type
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
    } catch {
      setIsBase64Image(false);
      setDecodedImagePreview(null);
      return false;
    }
  };

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col justify-between">
      <div className="flex items-center justify-center px-6 py-4">
        <div className="w-full max-w-5xl space-y-10">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold">Base64 Encoder</h1>
            <ThemeToggle />
          </div>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <InputSection
              setInputText={changeInputText}
              setIsImage={setIsImage}
              setImagePreview={setImagePreview}
              onFileNameChange={handleFileNameChange}
              checkBase64Image={checkBase64Image}
              isBase64Image={isBase64Image}
              resetDecodedState={resetDecodedState}
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
      <footer className="bg-muted text-muted-foreground border-border flex items-center justify-center border-t py-4">
        <p className="max-w-screen text-center text-sm text-slate-500">
          © {new Date().getFullYear()} S.R.L ITGROUP & SERVICES. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
