"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WavyBackground } from "@/components/ui/wavy-background";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface HeroSectionProps {
  name: string;
  tagline: string;
  bio: string;
  learnMoreButton: string;
  getInTouchButton: string;
}

export function HeroSection({
  name,
  tagline,
  bio,
  learnMoreButton,
  getInTouchButton,
}: HeroSectionProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Light theme colors
  const lightColors = ["#e0e7ff", "#c7d2fe", "#a5b4fc", "#818cf8", "#6366f1"];
  const lightBackground = "white";

  // Dark theme colors
  const darkColors = ["#1e1b4b", "#312e81", "#4338ca", "#6366f1", "#818cf8"];
  const darkBackground = "black";

  // Default to dark theme since it's forced, then use actual theme after mount
  const isDark = !mounted ? true : theme === "dark";
  const colors = isDark ? darkColors : lightColors;
  const backgroundFill = isDark ? darkBackground : lightBackground;

  return (
    <section className="relative min-h-screen">
      <WavyBackground
        key={`wavy-${theme}-${mounted}`}
        className="flex items-center justify-center"
        containerClassName="min-h-screen"
        colors={colors}
        waveWidth={50}
        backgroundFill={backgroundFill}
        blur={10}
        speed="slow"
        waveOpacity={isDark ? 0.5 : 0.3}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 py-28 md:py-36 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-4 text-foreground">
              {name}
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground/90 mb-6">
              {tagline}
            </p>
            <div className="h-1 w-32 bg-foreground/90 mx-auto mb-8" />
            <p className="text-lg md:text-xl text-foreground/85 mb-10 max-w-2xl mx-auto">
              {bio}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/about">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-6 py-6">
                  {learnMoreButton}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="border-border text-foreground hover:bg-muted hover:text-black dark:hover:text-white text-base px-6 py-6"
                >
                  {getInTouchButton}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </WavyBackground>
    </section>
  );
}
