// src/components/OptionsSection.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckedState } from "@radix-ui/react-checkbox";
import { cn } from "@/lib/utils";
import { encode } from "iconv-lite"; // Import iconv-lite

interface OptionsSectionProps {
  onEncode: (encodedText: string) => void;
  inputText: string;
}

export default function OptionsSection({
  onEncode,
  inputText,
}: OptionsSectionProps) {
  const [encodeEachLine, setEncodeEachLine] = useState(false);
  const [splitLines, setSplitLines] = useState(false);
  const [urlSafe, setUrlSafe] = useState(false);
  const [newlineSeparator, setNewlineSeparator] = useState("LF");
  const [charSet, setCharSet] = useState("UTF-8");

  // Re-encode whenever options or input change
  useEffect(() => {
    handleEncode();
  }, [
    encodeEachLine,
    splitLines,
    urlSafe,
    newlineSeparator,
    charSet,
    inputText,
  ]);

  const handleEncodeEachLineChange = (checked: CheckedState) => {
    const newValue = checked === true;
    setEncodeEachLine(newValue);
    if (newValue) setSplitLines(false);
  };

  const handleSplitLinesChange = (checked: CheckedState) => {
    const newValue = checked === true;
    setSplitLines(newValue);
    if (newValue) setEncodeEachLine(false);
  };

  const handleUrlSafeChange = (checked: CheckedState) => {
    setUrlSafe(checked === true);
  };

  const handleEncode = () => {
    if (!inputText) {
      onEncode("");
      return;
    }

    let result = "";
    const separator = newlineSeparator === "CRLF" ? "\r\n" : "\n";

    // Encode the input text to the selected charset using iconv-lite
    const textBuffer = encode(inputText, charSet); // Convert to Buffer with selected charset

    if (encodeEachLine) {
      const lines = inputText.split("\n");
      result = lines
        .map((line) => {
          if (!line) return "";
          const lineBuffer = encode(line, charSet); // Encode each line
          const encoded = Buffer.from(lineBuffer).toString("base64");
          return urlSafe
            ? encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
            : encoded;
        })
        .join(separator);
    } else {
      let encoded = Buffer.from(textBuffer).toString("base64");
      if (urlSafe) {
        encoded = encoded
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");
      }
      if (splitLines) {
        const chunkSize = 76;
        const chunks =
          encoded.match(new RegExp(`.{1,${chunkSize}}`, "g")) || [];
        result = chunks.join(separator);
      } else {
        result = encoded;
      }
    }

    onEncode(result);
  };

  return (
    <div className="p-6 bg-card rounded-xl shadow-md border border-border">
      <h2 className="text-xl font-semibold mb-4 text-card-foreground">
        Encoding Options
      </h2>
      <div className="space-y-4">
        <div
          className={cn(
            "flex items-center space-x-3",
            splitLines && "opacity-50 transition-opacity duration-300",
            encodeEachLine && "option-highlight"
          )}
        >
          <Checkbox
            id="encodeEachLine"
            checked={encodeEachLine}
            onCheckedChange={handleEncodeEachLineChange}
            disabled={splitLines}
            className="border-border"
          />
          <label
            htmlFor="encodeEachLine"
            className="text-muted-foreground text-sm"
          >
            Encode each line separately
          </label>
        </div>
        <div
          className={cn(
            "flex items-center space-x-3",
            encodeEachLine && "opacity-50 transition-opacity duration-300",
            splitLines && "option-highlight"
          )}
        >
          <Checkbox
            id="splitLines"
            checked={splitLines}
            onCheckedChange={handleSplitLinesChange}
            disabled={encodeEachLine}
            className="border-border"
          />
          <label htmlFor="splitLines" className="text-muted-foreground text-sm">
            Split lines into 76-character chunks
          </label>
        </div>
        {splitLines && (
          <Select value={newlineSeparator} onValueChange={setNewlineSeparator}>
            <SelectTrigger className="w-full bg-secondary border-border text-foreground">
              <SelectValue placeholder="Select newline separator" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-card-foreground">
              <SelectItem value="LF">LF (Unix)</SelectItem>
              <SelectItem value="CRLF">CRLF (Windows)</SelectItem>
            </SelectContent>
          </Select>
        )}
        <div
          className={cn(
            "flex items-center space-x-3",
            urlSafe && "option-highlight"
          )}
        >
          <Checkbox
            id="urlSafe"
            checked={urlSafe}
            onCheckedChange={handleUrlSafeChange}
            className="border-border"
          />
          <label htmlFor="urlSafe" className="text-muted-foreground text-sm">
            Perform URL-safe encoding
          </label>
        </div>
        <Select value={charSet} onValueChange={setCharSet}>
          <SelectTrigger className="w-full bg-secondary border-border text-foreground">
            <SelectValue placeholder="Select character set" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border text-card-foreground max-h-60 overflow-y-auto">
            <SelectItem value="UTF-8">UTF-8</SelectItem>
            <SelectItem value="ASCII">ASCII</SelectItem>
            <SelectItem value="ISO-8859-1">ISO-8859-1</SelectItem>
            <SelectItem value="ISO-8859-2">ISO-8859-2</SelectItem>
            <SelectItem value="ISO-8859-6">ISO-8859-6</SelectItem>
            <SelectItem value="ISO-8859-15">ISO-8859-15</SelectItem>
            <SelectItem value="Windows-1252">Windows-1252</SelectItem>
            <SelectItem value="ARMSCII-8">ARMSCII-8</SelectItem>
            <SelectItem value="BIG-5">BIG-5</SelectItem>
            <SelectItem value="CP850">CP850</SelectItem>
            <SelectItem value="CP866">CP866</SelectItem>
            <SelectItem value="CP932">CP932</SelectItem>
            <SelectItem value="CP936">CP936</SelectItem>
            <SelectItem value="CP950">CP950</SelectItem>
            <SelectItem value="CP50220">CP50220</SelectItem>
            <SelectItem value="CP50221">CP50221</SelectItem>
            <SelectItem value="CP51932">CP51932</SelectItem>
            <SelectItem value="EUC-JP">EUC-JP</SelectItem>
            <SelectItem value="EUC-KR">EUC-KR</SelectItem>
            <SelectItem value="EUC-TW">EUC-TW</SelectItem>
            <SelectItem value="GB18030">GB18030</SelectItem>
            <SelectItem value="HZ">HZ</SelectItem>
            <SelectItem value="ISO-2022-JP">ISO-2022-JP</SelectItem>
            <SelectItem value="ISO-2022-KR">ISO-2022-KR</SelectItem>
            <SelectItem value="ISO-8859-3">ISO-8859-3</SelectItem>
            <SelectItem value="ISO-8859-4">ISO-8859-4</SelectItem>
            <SelectItem value="ISO-8859-5">ISO-8859-5</SelectItem>
            <SelectItem value="ISO-8859-7">ISO-8859-7</SelectItem>
            <SelectItem value="ISO-8859-8">ISO-8859-8</SelectItem>
            <SelectItem value="ISO-8859-9">ISO-8859-9</SelectItem>
            <SelectItem value="ISO-8859-10">ISO-8859-10</SelectItem>
            <SelectItem value="ISO-8859-13">ISO-8859-13</SelectItem>
            <SelectItem value="ISO-8859-14">ISO-8859-14</SelectItem>
            <SelectItem value="ISO-8859-16">ISO-8859-16</SelectItem>
            <SelectItem value="JIS">JIS</SelectItem>
            <SelectItem value="KOI8-R">KOI8-R</SelectItem>
            <SelectItem value="KOI8-U">KOI8-U</SelectItem>
            <SelectItem value="SJIS">SJIS</SelectItem>
            <SelectItem value="UCS-2">UCS-2</SelectItem>
            <SelectItem value="UCS-4">UCS-4</SelectItem>
            <SelectItem value="UCS-4BE">UCS-4BE</SelectItem>
            <SelectItem value="UCS-4LE">UCS-4LE</SelectItem>
            <SelectItem value="UHC">UHC</SelectItem>
            <SelectItem value="UTF-7">UTF-7</SelectItem>
            <SelectItem value="UTF-16">UTF-16</SelectItem>
            <SelectItem value="UTF-16BE">UTF-16BE</SelectItem>
            <SelectItem value="UTF-16LE">UTF-16LE</SelectItem>
            <SelectItem value="UTF-32">UTF-32</SelectItem>
            <SelectItem value="UTF-32BE">UTF-32BE</SelectItem>
            <SelectItem value="UTF-32LE">UTF-32LE</SelectItem>
            <SelectItem value="UTF7-IMAP">UTF7-IMAP</SelectItem>
            <SelectItem value="Windows-1251">Windows-1251</SelectItem>
            <SelectItem value="Windows-1254">Windows-1254</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        className="mt-6 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 rounded-lg transition-all duration-300 active:scale-95"
        onClick={handleEncode}
      >
        Encode
      </Button>
    </div>
  );
}
