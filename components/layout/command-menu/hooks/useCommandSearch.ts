"use client";

import * as React from "react";
import { searchEntities, type SearchResult } from "@/features/search/actions";

const clientSearchCache = new Map<string, SearchResult[]>();

function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

export function useCommandSearch(inputValue: string) {
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const debouncedQuery = useDebounce(inputValue, 200);

  React.useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (!trimmed || trimmed.length < 2) {
      const timer = setTimeout(() => {
        setSearchResults([]);
        setIsSearching(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    const cacheKey = trimmed.toLowerCase();
    if (clientSearchCache.has(cacheKey)) {
      const cached = clientSearchCache.get(cacheKey)!;
      const timer = setTimeout(() => {
        setSearchResults(cached);
        setIsSearching(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    let cancelled = false;
    const timer = setTimeout(() => {
      setIsSearching(true);
    }, 0);

    searchEntities(trimmed).then((res) => {
      if (cancelled) return;
      setIsSearching(false);
      if (res.success && res.data) {
        clientSearchCache.set(cacheKey, res.data);
        setSearchResults(res.data);
      }
    });

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [debouncedQuery]);

  const groupedResults = React.useMemo(() => {
    const groups: Partial<Record<SearchResult["category"], SearchResult[]>> = {};
    for (const result of searchResults) {
      if (!groups[result.category]) {
        groups[result.category] = [];
      }
      groups[result.category]!.push(result);
    }
    return groups;
  }, [searchResults]);

  return {
    searchResults,
    setSearchResults,
    isSearching,
    groupedResults,
  };
}
