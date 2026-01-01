import { useMemo, useState, useCallback } from "react";
import type { TechItem, TechCategory } from "@/types/tech";

interface UseTechFilteringProps {
  techList: TechItem[];
  categories: TechCategory[];
}

interface UseTechFilteringReturn {
  filteredTech: TechItem[];
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
}

/**
 * Hook for filtering technologies by category and search keyword
 * Keeps search keyword as local state (not URL-synced)
 */
export function useTechFiltering({
  techList,
  categories,
}: UseTechFilteringProps): UseTechFilteringReturn {
  const [searchKeyword, setSearchKeyword] = useState("");

  const filteredTech = useMemo(() => {
    const categoryFiltered = techList.filter((tech) =>
      categories.includes(tech.category)
    );

    if (!searchKeyword) return categoryFiltered;

    const keyword = searchKeyword.toLowerCase();
    return categoryFiltered.filter((tech) =>
      tech.name.toLowerCase().includes(keyword)
    );
  }, [techList, categories, searchKeyword]);

  return {
    filteredTech,
    searchKeyword,
    setSearchKeyword,
  };
}
