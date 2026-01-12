"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Search, X, Sun, Moon, Globe } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

const THRESHOLD_RATIO = 0.1;

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [language, setLanguage] = useState("EN");
  const [headerHeight, setHeaderHeight] = useState(96);
  const [isMounted, setIsMounted] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const syncViewportHeight = () => setViewportHeight(window.innerHeight || 0);
    const syncViewportWidth = () => setViewportWidth(window.innerWidth || 0);
    const syncHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setScrollProgress(Math.max(scrollTop, 0));
    };

    // Initialize values synchronously
    syncViewportHeight();
    syncViewportWidth();
    syncHeaderHeight();
    handleScroll();

    // Enable animations after initial values are set
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsMounted(true);
      });
    });

    // Use ResizeObserver to track header height changes
    const resizeObserver = new ResizeObserver(() => {
      syncHeaderHeight();
    });

    if (headerRef.current) {
      resizeObserver.observe(headerRef.current);
    }

    window.addEventListener("resize", () => {
      syncViewportHeight();
      syncViewportWidth();
      syncHeaderHeight();
    });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", syncViewportHeight);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Initialize to false to match server-side render (prevents hydration mismatch)
  // Only calculate condensed state after component is mounted to prevent hydration mismatch
  const isMobile = isMounted && viewportWidth > 0 && viewportWidth < 768; // md breakpoint
  const threshold = viewportHeight > 0 ? viewportHeight * THRESHOLD_RATIO : 0;
  const isCondensed = isMounted && (isMobile || scrollProgress >= threshold);

  // Set CSS variable for header height so pages can use it
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--header-height",
      `${headerHeight}px`
    );
  }, [headerHeight]);

  return (
    <>
      <motion.header
        ref={headerRef}
        initial={false}
        animate={{
          backdropFilter: isCondensed ? "blur(12px)" : "blur(4px)",
          boxShadow: isCondensed ? "0 1px 2px 0 rgba(0, 0, 0, 0.05)" : "none",
        }}
        transition={isMounted ? { duration: 0.3 } : { duration: 0 }}
        className={`fixed inset-x-0 top-0 z-50 border-b ${
          isCondensed
            ? "bg-white/80 dark:bg-black/80 shadow-sm border-black/10 dark:border-white/10"
            : "bg-white/20 dark:bg-black/20 shadow-none border-transparent"
        }`}
        suppressHydrationWarning
      >
        <motion.div
          initial={false}
          animate={{
            paddingTop: isCondensed ? 12 : 32,
            paddingBottom: isCondensed ? 12 : 32,
            paddingLeft: isCondensed ? 20 : 64,
            paddingRight: isCondensed ? 20 : 64,
          }}
          transition={isMounted ? { duration: 0.3 } : { duration: 0 }}
          className="mx-auto flex w-full items-center justify-between text-black dark:text-white"
          suppressHydrationWarning
        >
          <div className="flex items-center">
            <Link href="/">
              <div
                className={`font-bold tracking-tight flex flex-row items-center gap-2 ${
                  isMounted ? "transition-all duration-300" : ""
                } ${
                  isCondensed ? "text-xl md:text-2xl" : "text-2xl md:text-3xl"
                }`}
                suppressHydrationWarning
              >
                <span>Kartikeya</span>
                <span>Sharma</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 md:flex">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <input
                      type="text"
                      placeholder="Search"
                      autoFocus
                      className="h-9 w-[200px] border-b bg-transparent px-0 text-sm focus:outline-none border-black/70 text-black placeholder:text-gray-600 dark:border-white/70 dark:text-white dark:placeholder:text-white/70"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-black hover:bg-black/10 dark:text-white dark:hover:bg-white/20"
              >
                {isSearchOpen ? (
                  <X className={isCondensed ? "h-5 w-5" : "h-6 w-6"} />
                ) : (
                  <Search className={isCondensed ? "h-5 w-5" : "h-6 w-6"} />
                )}
              </Button>
            </div>
            <div className="flex md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-black hover:bg-black/10 dark:text-white dark:hover:bg-white/20"
              >
                {isSearchOpen ? (
                  <X className={isCondensed ? "h-5 w-5" : "h-6 w-6"} />
                ) : (
                  <Search className={isCondensed ? "h-5 w-5" : "h-6 w-6"} />
                )}
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-black hover:bg-black/10 dark:text-white dark:hover:bg-white/20"
                >
                  <Globe className={isCondensed ? "h-5 w-5" : "h-6 w-6"} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-none border">
                <DropdownMenuItem
                  onClick={() => setLanguage("EN")}
                  className="rounded-none"
                >
                  English
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("ES")}
                  className="rounded-none"
                >
                  Español
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("FR")}
                  className="rounded-none"
                >
                  Français
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("DE")}
                  className="rounded-none"
                >
                  Deutsch
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative text-black hover:bg-black/10 dark:text-white dark:hover:bg-white/20"
            >
              <Sun
                className={`${
                  isCondensed ? "h-5 w-5" : "h-6 w-6"
                } rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0`}
              />
              <Moon
                className={`absolute ${
                  isCondensed ? "h-5 w-5" : "h-6 w-6"
                } rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100`}
              />
            </Button>
          </div>
        </motion.div>
      </motion.header>
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              top: headerHeight,
            }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.2 },
              opacity: { duration: 0.2 },
              top: { duration: 0.15 }, // Faster transition for position changes
            }}
            className="md:hidden fixed inset-x-0 z-40 overflow-hidden border-b border-gray-300 bg-white dark:bg-black px-6"
          >
            <div className="py-2">
              <input
                type="text"
                placeholder="Search"
                autoFocus
                className="h-10 w-full border-b bg-transparent text-sm focus:outline-none border-gray-300 text-black placeholder:text-gray-500 dark:border-white/60 dark:text-white dark:placeholder:text-gray-300"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
