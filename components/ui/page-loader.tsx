"use client";

import { Helix } from "ldrs/react";
import "ldrs/react/Helix.css";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function PageLoader() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const color = theme === "light" ? "black" : "white";

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
