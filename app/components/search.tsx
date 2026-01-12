"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Briefcase,
  BookOpen,
  Award,
  Home,
  GraduationCap,
  Heart,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import type { SearchIndexEntry } from "@/lib/search-index";

interface SearchComponentProps {
  isCondensed?: boolean;
  headerHeight?: number;
}

export function SearchComponent({
  isCondensed = false,
  headerHeight = 96,
}: SearchComponentProps) {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchIndex, setSearchIndex] = useState<SearchIndexEntry[]>([]);
  const [searchResults, setSearchResults] = useState<SearchIndexEntry[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoadingIndex, setIsLoadingIndex] = useState(false);
  const [indexFetchError, setIndexFetchError] = useState(false);
  const [searchWidth, setSearchWidth] = useState(450);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Set responsive search width based on screen size
  useEffect(() => {
    const updateSearchWidth = () => {
      if (window.innerWidth >= 1024) {
        // lg screens and above
        setSearchWidth(450);
      } else if (window.innerWidth >= 768) {
        // md screens
        setSearchWidth(350);
      } else {
        // sm screens
        setSearchWidth(200);
      }
    };

    updateSearchWidth();
    window.addEventListener("resize", updateSearchWidth);
    return () => window.removeEventListener("resize", updateSearchWidth);
  }, []);

  // Fetch search index when search opens
  useEffect(() => {
    if (
      isSearchOpen &&
      searchIndex.length === 0 &&
      !isLoadingIndex &&
      !indexFetchError
    ) {
      setIsLoadingIndex(true);
      setIndexFetchError(false);
      fetch("/api/search/index")
        .then(async (res) => {
          const data = await res.json();

          if (!res.ok) {
            // Handle API error responses (like 404 when index not built)
            const errorMessage =
              data.error || `Failed to fetch: ${res.statusText}`;
            throw new Error(errorMessage);
          }

          if (data.index && Array.isArray(data.index)) {
            setSearchIndex(data.index);
            setIndexFetchError(false);
          } else {
            throw new Error("No index data in response");
          }
        })
        .catch((err) => {
          console.error("Failed to fetch search index:", err);
          setIndexFetchError(true);
        })
        .finally(() => {
          setIsLoadingIndex(false);
        });
    }
  }, [isSearchOpen, searchIndex.length, isLoadingIndex, indexFetchError]);

  // Filter search results
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSelectedIndex(0);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const words = query.split(/\s+/);

    const filtered = searchIndex
      .filter((entry) => {
        const searchText = entry.searchableText.toLowerCase();
        const titleMatch = entry.title.toLowerCase().includes(query);
        const textMatch = words.every((word) => searchText.includes(word));
        const keywordMatch = entry.keywords.some((keyword) =>
          keyword.toLowerCase().includes(query)
        );

        return titleMatch || textMatch || keywordMatch;
      })
      .sort((a, b) => {
        // Prioritize exact title matches
        const aTitleMatch = a.title.toLowerCase().startsWith(query);
        const bTitleMatch = b.title.toLowerCase().startsWith(query);
        if (aTitleMatch && !bTitleMatch) return -1;
        if (!aTitleMatch && bTitleMatch) return 1;

        // Then prioritize title contains
        const aTitleContains = a.title.toLowerCase().includes(query);
        const bTitleContains = b.title.toLowerCase().includes(query);
        if (aTitleContains && !bTitleContains) return -1;
        if (!aTitleContains && bTitleContains) return 1;

        // Then by recency (year)
        if (a.year && b.year) {
          return b.year - a.year;
        }
        if (a.year) return -1;
        if (b.year) return 1;

        return 0;
      })
      .slice(0, 10); // Limit to 10 results

    setSearchResults(filtered);
    setSelectedIndex(0);
  }, [searchQuery, searchIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 100);
      }

      // Escape to close search
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }

      // Arrow keys navigation
      if (isSearchOpen && searchResults.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < searchResults.length - 1 ? prev + 1 : prev
          );
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        } else if (e.key === "Enter" && searchResults[selectedIndex]) {
          e.preventDefault();
          router.push(searchResults[selectedIndex].url);
          setIsSearchOpen(false);
          setSearchQuery("");
          setSearchResults([]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, searchResults, selectedIndex, router]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  const getTypeIcon = (type: SearchIndexEntry["type"]) => {
    switch (type) {
      case "experience":
        return <Briefcase className="h-4 w-4" />;
      case "publication":
        return <BookOpen className="h-4 w-4" />;
      case "achievement":
        return <Award className="h-4 w-4" />;
      case "page":
        return <Home className="h-4 w-4" />;
      case "skill":
      case "education":
        return <GraduationCap className="h-4 w-4" />;
      case "extracurricular":
        return <Heart className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: SearchIndexEntry["type"]) => {
    switch (type) {
      case "experience":
        return "Experience";
      case "publication":
        return "Publication";
      case "achievement":
        return "Achievement";
      case "page":
        return "Page";
      case "skill":
        return "Skill";
      case "education":
        return "Education";
      case "extracurricular":
        return "Extracurricular";
      default:
        return "Result";
    }
  };

  const handleResultClick = (url: string) => {
    router.push(url);
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleToggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchQuery("");
      setSearchResults([]);
    } else {
      // Reset error state when opening search to allow retry
      setIndexFetchError(false);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  return (
    <>
      {/* Desktop Search */}
      <div className="hidden items-center gap-2 md:flex relative">
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ transformOrigin: "right", width: searchWidth }}
              className="overflow-hidden"
            >
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="h-9 w-full min-w-0 border-b bg-transparent px-0 text-sm focus:outline-none border-black/70 text-black placeholder:text-gray-600 dark:border-white/70 dark:text-white dark:placeholder:text-white/70"
              />
              {/* Search Results Dropdown */}
              {searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-black border border-black/20 dark:border-white/20 shadow-lg max-h-[400px] overflow-y-auto z-50"
                >
                  {isLoadingIndex ? (
                    <div className="p-4 text-sm text-gray-600 dark:text-gray-400">
                      Loading search index...
                    </div>
                  ) : indexFetchError ? (
                    <div className="p-4 text-sm text-red-600 dark:text-red-400">
                      <div className="font-medium mb-1">
                        Search index not available
                      </div>
                      <div className="text-xs text-red-500 dark:text-red-500">
                        Please rebuild the search index in the admin panel.
                      </div>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-4 text-sm text-gray-600 dark:text-gray-400">
                      No results found
                    </div>
                  ) : (
                    <>
                      {searchResults.map((result, index) => (
                        <button
                          key={result.id}
                          onClick={() => handleResultClick(result.url)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`w-full text-left px-4 py-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors border-b border-black/5 dark:border-white/5 last:border-0 ${
                            index === selectedIndex
                              ? "bg-black/10 dark:bg-white/10"
                              : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 text-gray-600 dark:text-gray-400">
                              {getTypeIcon(result.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm text-black dark:text-white truncate">
                                  {result.title}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
                                  {getTypeLabel(result.type)}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                                {result.preview}
                              </p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400 dark:text-gray-500 shrink-0 mt-0.5" />
                          </div>
                        </button>
                      ))}
                      <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-t border-black/5 dark:border-white/5 bg-gray-50 dark:bg-gray-900">
                        Use ↑↓ to navigate, Enter to select, Esc to close
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleSearch}
          className="text-black hover:bg-black/10 dark:text-white dark:hover:bg-white/20"
        >
          {isSearchOpen ? (
            <X className={isCondensed ? "h-5 w-5" : "h-6 w-6"} />
          ) : (
            <Search className={isCondensed ? "h-5 w-5" : "h-6 w-6"} />
          )}
        </Button>
      </div>

      {/* Mobile Search */}
      <div className="flex md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleSearch}
          className="text-black hover:bg-black/10 dark:text-white dark:hover:bg-white/20"
        >
          {isSearchOpen ? (
            <X className={isCondensed ? "h-5 w-5" : "h-6 w-6"} />
          ) : (
            <Search className={isCondensed ? "h-5 w-5" : "h-6 w-6"} />
          )}
        </Button>
      </div>

      {/* Mobile Search Panel */}
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
              top: { duration: 0.15 },
            }}
            className="md:hidden fixed inset-x-0 z-40 overflow-hidden border-b border-gray-300 bg-white dark:bg-black"
          >
            <div className="px-6 py-2">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="h-10 w-full border-b bg-transparent text-sm focus:outline-none border-gray-300 text-black placeholder:text-gray-500 dark:border-white/60 dark:text-white dark:placeholder:text-gray-300"
              />
            </div>
            {/* Mobile Search Results */}
            {searchQuery && (
              <div className="max-h-[60vh] overflow-y-auto border-t border-gray-200 dark:border-white/10">
                {isLoadingIndex ? (
                  <div className="p-4 text-sm text-gray-600 dark:text-gray-400">
                    Loading search index...
                  </div>
                ) : indexFetchError ? (
                  <div className="p-4 text-sm text-red-600 dark:text-red-400">
                    <div className="font-medium mb-1">
                      Search index not available
                    </div>
                    <div className="text-xs text-red-500 dark:text-red-500">
                      Please rebuild the search index in the admin panel.
                    </div>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-4 text-sm text-gray-600 dark:text-gray-400">
                    No results found
                  </div>
                ) : (
                  <>
                    {searchResults.map((result, index) => (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result.url)}
                        className={`w-full text-left px-6 py-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors border-b border-gray-200 dark:border-white/10 last:border-0 ${
                          index === selectedIndex
                            ? "bg-black/10 dark:bg-white/10"
                            : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 text-gray-600 dark:text-gray-400">
                            {getTypeIcon(result.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm text-black dark:text-white">
                                {result.title}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
                                {getTypeLabel(result.type)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                              {result.preview}
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400 dark:text-gray-500 shrink-0 mt-0.5" />
                        </div>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
