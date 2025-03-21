import { encode, encodeURL } from "js-base64";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as iconv from "iconv-lite";

// Utility function to merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Base64 encoding function with character set handling
export function encodeToBase64(
  text: string,
  options: {
    encodeEachLine: boolean;
    splitLines: boolean;
    urlSafe: boolean;
    newlineSeparator: string;
    charSet: string;
  }
): string {
  let buffer: Buffer;

  // Convert the input text to a byte array based on the character set
  try {
    // Check if the character set is supported by iconv-lite
    if (iconv.encodingExists(options.charSet)) {
      buffer = iconv.encode(text, options.charSet);
    } else {
      console.warn(
        `Character set '${options.charSet}' is not supported by iconv-lite. Falling back to UTF-8.`
      );
      buffer = iconv.encode(text, "UTF-8");
    }
  } catch (error) {
    console.error(`Error encoding text with ${options.charSet}:`, error);
    // Fallback to UTF-8 if encoding fails
    buffer = iconv.encode(text, "UTF-8");
  }

  // Convert the Buffer to a binary string for Base64 encoding
  let binaryString = "";
  for (let i = 0; i < buffer.length; i++) {
    binaryString += String.fromCharCode(buffer[i]);
  }

  // Encode each line separately
  let result: string;
  if (options.encodeEachLine) {
    result = binaryString
      .split("\n")
      .map((line) => (options.urlSafe ? encodeURL(line) : encode(line)))
      .join("\n");
  } else {
    result = options.urlSafe ? encodeURL(binaryString) : encode(binaryString);
  }

  // Split lines into 76-character chunks
  if (options.splitLines) {
    const separator = options.newlineSeparator === "LF" ? "\n" : "\r\n";
    result = result.match(/.{1,76}/g)?.join(separator) || result;
  }

  return result;
}
