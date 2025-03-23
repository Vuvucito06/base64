"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileImage, File, Loader2, Image } from "lucide-react";

export default function InputSection({
  setInputText,
  setIsImage,
  setImagePreview,
  onFileNameChange,
  checkBase64Image,
  isBase64Image,
}: {
  setInputText: (text: string) => void;
  setIsImage: (isImage: boolean) => void;
  setImagePreview: (preview: string | null) => void;
  onFileNameChange: (name: string | null) => void;
  checkBase64Image: (text: string) => boolean;
  isBase64Image: boolean;
}) {
  const [fileContent, setFileContent] = useState("");
  const [isDropping, setIsDropping] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
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
    ]
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
  };

  return (
    <div className="p-6 bg-card rounded-xl shadow-md border border-border">
      <h2 className="text-xl font-semibold mb-4 text-card-foreground">
        Insert Text or Image
      </h2>

      {imageSrc ? (
        <div className="relative min-h-[200px] bg-secondary border border-border rounded-md flex items-center justify-center overflow-hidden">
          {fileName && (
            <div className="absolute top-2 right-2 bg-card px-2 py-1 rounded text-xs text-muted-foreground">
              {fileName}
            </div>
          )}
          <img
            src={imageSrc}
            alt="Preview"
            className="max-w-full max-h-[300px] object-contain"
          />
        </div>
      ) : isBase64Image ? (
        <div className="relative min-h-[200px] bg-secondary border border-border rounded-md flex flex-col items-center justify-center overflow-hidden p-4">
          <Image className="h-12 w-12 text-muted-foreground mb-2" />
          <div className="text-center text-muted-foreground">
            <p className="font-medium">Base64 Image Detected</p>
            <p className="text-sm mt-1">Text contains an encoded image</p>
            {fileName && <p className="text-xs mt-1">Source: {fileName}</p>}
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 w-12 bg-secondary border-r border-border text-right pr-2 text-muted-foreground font-mono text-sm">
            {lines.map((line) => (
              <div key={line.number} className="h-6 leading-6">
                {line.number}
              </div>
            ))}
          </div>
          <Textarea
            className="w-full pl-14 bg-secondary border-border text-foreground font-mono text-sm resize-none focus:ring-2 focus:ring-primary min-h-[200px]"
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
          "p-4 border-dashed border-2 rounded mt-4 text-center text-muted-foreground flex items-center justify-center h-20",
          isDragActive ? "border-primary bg-primary/10" : "border-border",
          isDropping && "border-primary"
        )}
      >
        <input {...getInputProps()} />
        {isDropping ? (
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
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
        className="mt-4 w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium py-2 rounded-lg transition-all duration-300 active:scale-95"
        onClick={handleClear}
      >
        Clear
      </Button>
    </div>
  );
}
