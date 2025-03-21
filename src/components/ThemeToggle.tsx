// src/components/ThemeToggle.tsx
"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    if (newTheme === theme) return;

    // Add transition class to body
    const body = document.body;
    body.classList.add("theme-transition");

    // Apply the new theme
    setTheme(newTheme);

    // Remove transition class after animation completes
    setTimeout(() => {
      body.classList.remove("theme-transition");
    }, 600); // Matches --transition-duration in globals.css
  };

  if (!mounted) return null;

  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleThemeChange("light")}
        className={cn(
          theme === "light" && "bg-primary text-primary-foreground",
          "hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <Sun className="h-5 w-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleThemeChange("dark")}
        className={cn(
          theme === "dark" && "bg-primary text-primary-foreground",
          "hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <Moon className="h-5 w-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleThemeChange("system")}
        className={cn(
          theme === "system" && "bg-primary text-primary-foreground",
          "hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <Monitor className="h-5 w-5" />
      </Button>
    </div>
  );
}
