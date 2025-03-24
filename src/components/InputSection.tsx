"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileImage, File, Loader2, Image as ImageIcon } from "lucide-react";

export default function InputSection({
  setInputText,
  setIsImage,
  setImagePreview,
  onFileNameChange,
  checkBase64Image,
  isBase64Image,
  resetDecodedState, // Add the new prop
}: {
  setInputText: (text: string) => void;
  setIsImage: (isImage: boolean) => void;
  setImagePreview: (preview: string | null) => void;
  onFileNameChange: (name: string | null) => void;
  checkBase64Image: (text: string) => boolean;
  isBase64Image: boolean;
  resetDecodedState: () => void; // Define the new prop type
}) {
  const [fileContent, setFileContent] = useState("");
  const [isDropping, setIsDropping] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const setFileType = useState<string | null>(null)[1];
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setIsDropping(true);
      const file = acceptedFiles[0];
      if (file) {
        setFileName(file.name);
        setFileType(file.type);
        onFileNameChange(file.name);

        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const content = e.target?.result as string;
            const base64Content = content.split(",")[1];
            setFileContent("");
            setInputText(base64Content);
            setIsImage(true);
            setImagePreview(content);
            setImageSrc(content);
            setIsDropping(false);
          };
          reader.readAsDataURL(file);
        } else {
          const reader = new FileReader();
          reader.onload = (e) => {
            const content = e.target?.result as string;
            setFileContent(content);
            setInputText(content);
            setIsImage(false);
            setImagePreview(null);
            setImageSrc(null);

            const isBase64Img = checkBase64Image(content);
            if (isBase64Img) {
              setFileContent(`Base64 image detected in file: ${file.name}`);
            }

            setIsDropping(false);
          };
          reader.readAsText(file);
        }
      } else {
        setIsDropping(false);
      }
    },
    [
      setInputText,
      setIsImage,
      setImagePreview,
      onFileNameChange,
      checkBase64Image,
    ],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "text/plain": [".txt"],
      "application/json": [".json"],
      "text/html": [".html", ".htm"],
      "text/csv": [".csv"],
      "text/javascript": [".js"],
      "text/css": [".css"],
    },
  });

  const lines = fileContent.split("\n").map((line, index) => ({
    number: index + 1,
    content: line,
  }));

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFileContent(value);
    setInputText(value);
    setIsImage(false);
    setImagePreview(null);
    setFileName(null);
    setFileType(null);
    setImageSrc(null);
    onFileNameChange(null);
    checkBase64Image(value);
  };

  const handleClear = () => {
    setFileContent("");
    setInputText("");
    setIsImage(false);
    setImagePreview(null);
    setFileName(null);
    setFileType(null);
    setImageSrc(null);
    onFileNameChange(null);
    resetDecodedState(); // Call the new function to reset decoded image states
  };

  return (
    <div className="bg-card border-border rounded-xl border p-6 shadow-md">
      <h2 className="text-card-foreground mb-4 text-xl font-semibold">
        Insert Text or Image
      </h2>

      {imageSrc ? (
        <div className="bg-secondary border-border relative flex min-h-[200px] items-center justify-center overflow-hidden rounded-md border">
          {fileName && (
            <div className="bg-card text-muted-foreground absolute top-2 right-2 rounded px-2 py-1 text-xs">
              {fileName}
            </div>
          )}
          <img
            src={imageSrc}
            alt="Preview"
            className="max-h-[300px] max-w-full object-contain"
          />
        </div>
      ) : isBase64Image ? (
        <div className="bg-secondary border-border relative flex min-h-[200px] flex-col items-center justify-center overflow-hidden rounded-md border p-4">
          <ImageIcon className="text-muted-foreground mb-2 h-12 w-12" />
          <div className="text-muted-foreground text-center">
            <p className="font-medium">Base64 Image Detected</p>
            <p className="mt-1 text-sm">Text contains an encoded image</p>
            {fileName && <p className="mt-1 text-xs">Source: {fileName}</p>}
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="bg-secondary border-border text-muted-foreground absolute inset-y-0 left-0 w-12 border-r pr-2 text-right font-mono text-sm">
            {lines.map((line) => (
              <div key={line.number} className="h-6 leading-6">
                {line.number}
              </div>
            ))}
          </div>
          <Textarea
            className="bg-secondary border-border text-foreground focus:ring-primary min-h-[200px] w-full resize-none pl-14 font-mono text-sm focus:ring-2"
            rows={Math.max(lines.length, 8)}
            placeholder="Enter text or drop a file..."
            value={fileContent}
            onChange={handleTextChange}
          />
        </div>
      )}

      <div
        {...getRootProps()}
        className={cn(
          "text-muted-foreground mt-4 flex h-20 items-center justify-center rounded border-2 border-dashed p-4 text-center",
          isDragActive ? "border-primary bg-primary/10" : "border-border",
          isDropping && "border-primary",
        )}
      >
        <input {...getInputProps()} />
        {isDropping ? (
          <Loader2 className="text-primary h-6 w-6 animate-spin" />
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-2">
              <FileImage className="h-5 w-5" />
              <File className="h-5 w-5" />
              <p>
                Drag and drop or click to upload (images, .txt, .json, .html,
                .js, .css, .csv)
              </p>
            </div>
          </div>
        )}
      </div>

      <Button
        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground mt-4 w-full rounded-lg py-2 font-medium transition-all duration-300 active:scale-95"
        onClick={handleClear}
      >
        Clear
      </Button>
    </div>
  );
}
