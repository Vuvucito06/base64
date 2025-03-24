// src/app/layout.tsx
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google"; // Corrected imports
import { ThemeProvider } from "next-themes";
import { registerPageView } from "@/lib/analytics";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Base64 Encoder",
  description: "A simple tool to encode text into Base64",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  registerPageView();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${openSans.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
