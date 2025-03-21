// src/app/page.tsx
"use client";

import { useState } from "react";
import InputSection from "@/components/InputSection";
import OptionsSection from "@/components/OptionsSection";
import OutputSection from "@/components/OutputSection";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [encodedText, setEncodedText] = useState("");

  const handleEncode = (encodedText: string) => {
    setEncodedText(encodedText);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top Half: Encoder and Output */}
      <div className="flex-1 p-10 flex items-center justify-center">
        <div className="max-w-5xl w-full space-y-10">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">Base64 Encoder</h1>
            <ThemeToggle />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <InputSection setInputText={setInputText} />
            <div className="space-y-10">
              <OptionsSection onEncode={handleEncode} inputText={inputText} />
              <OutputSection encodedText={encodedText} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Half: Copyright */}
      <footer className="flex-1 flex items-center justify-center bg-muted text-muted-foreground border-t border-border">
        <p className="text-base">
          © {new Date().getFullYear()} Base64 Encoder. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
