// src/components/InputSection.tsx
"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function InputSection({
  setInputText,
}: {
  setInputText: (text: string) => void;
}) {
  const [fileContent, setFileContent] = useState("");
  const [isDropping, setIsDropping] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setIsDropping(true);
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setFileContent(content);
          setInputText(content);
          setIsDropping(false);
        };
        reader.readAsText(file);
      } else {
        setIsDropping(false);
      }
    },
    [setInputText]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const lines = fileContent.split("\n").map((line, index) => ({
    number: index + 1,
    content: line,
  }));

  return (
    <div className="p-6 bg-card rounded-xl shadow-md border border-border">
      <h2 className="text-xl font-semibold mb-4 text-card-foreground">
        Insert Text
      </h2>
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
          onChange={(e) => {
            setFileContent(e.target.value);
            setInputText(e.target.value);
          }}
        />
      </div>
      <div
        {...getRootProps()}
        className={cn(
          "p-4 border-dashed border-2 rounded mt-4 text-center text-muted-foreground flex items-center justify-center",
          isDragActive ? "border-primary" : "border-border"
        )}
      >
        <input {...getInputProps()} />
        {isDropping ? (
          <span className="spinner" />
        ) : (
          <p>Drag and Drop or Click to Upload (.txt files)</p>
        )}
      </div>
    </div>
  );
}
