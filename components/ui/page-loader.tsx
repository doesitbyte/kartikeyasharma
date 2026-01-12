"use client";

import { Helix } from "ldrs/react";
import "ldrs/react/Helix.css";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function PageLoader() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [color, setColor] = useState("white");

  useEffect(() => {
    setMounted(true);
    // Get computed foreground color from CSS variable
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    const foregroundColor = computedStyle.getPropertyValue("--foreground").trim();
    
    // Convert oklch to a usable color, or use theme-based fallback
    if (theme === "light") {
      setColor("black");
    } else {
      setColor("white");
    }
  }, [theme]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-md">
      <div className="flex flex-col items-center gap-4">
        {mounted && <Helix size="45" speed="2.5" color={color} />}
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
