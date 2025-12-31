import { useState, useMemo, useCallback } from "react";
import { toast } from "@/lib/use-toast";
import type { TechItem, TechCategory } from "@/types/tech";
import { TECH_STACK } from "@/data/tech-stack-data";

type PerLine = 5 | 6 | 7 | 8 | 9 | 10;

interface UseIconGridGeneratorProps {
  title: string;
  techList: TechItem[];
  categories: TechCategory[];
}

export const useIconGridGenerator = ({
  title,
  techList,
  categories,
}: UseIconGridGeneratorProps) => {
  const [selectedTech, setSelectedTech] = useState<TechItem[]>([]);
  const [perLine, setPerLine] = useState<PerLine>(10);
  const [generatedMarkdown, setGeneratedMarkdown] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);
  const [includeTitle, setIncludeTitle] = useState(true);
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

  const selectedTechSet = useMemo(
    () => new Set(selectedTech.map((tech) => tech.id)),
    [selectedTech]
  );

  const selectedIconIds = useMemo(
    () => selectedTech.map((tech) => tech.id),
    [selectedTech]
  );

  const generateMarkdown = useCallback(() => {
    const iconSize = 48;
    const icons = selectedTech
      .map((tech) => {
        const techData = TECH_STACK[tech.id as keyof typeof TECH_STACK];
        const iconifyId = techData?.iconify || `logos:${tech.id}`;
        const iconUrl = `https://api.iconify.design/${iconifyId}.svg?width=${iconSize}&height=${iconSize}`;
        const link =
          (techData && "link" in techData ? techData.link : undefined) ||
          `https://simpleicons.org/?q=${encodeURIComponent(tech.name)}`;
        return `<a href="${link}" target="_blank" rel="noopener noreferrer"><img src="${iconUrl}" alt="${tech.name}" width="${iconSize}" height="${iconSize}" /></a>`;
      })
      .join(" ");

    const titleSection =
      includeTitle && title !== "All" ? `### ${title}\n\n` : "";
    const markdown = `${titleSection}<p align="center">\n  ${icons}\n</p>`;
    setGeneratedMarkdown(markdown);
  }, [selectedTech, includeTitle, title]);

  const copyToClipboard = useCallback(() => {
    if (!generatedMarkdown) {
      toast({
        title: "No Markdown generated",
        description: "Please click the Generate button first",
        variant: "destructive",
      });
      return;
    }

    navigator.clipboard
      .writeText(generatedMarkdown)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        toast({
          title: "Copied to clipboard",
          description: "Markdown has been copied to clipboard",
        });
      })
      .catch(() => {
        toast({
          title: "Copy failed",
          description: "Please try again",
          variant: "destructive",
        });
      });
  }, [generatedMarkdown]);

  const handleTechToggle = useCallback((tech: TechItem) => {
    setSelectedTech((prev) =>
      prev.some((item) => item.id === tech.id)
        ? prev.filter((item) => item.id !== tech.id)
        : [...prev, tech]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedTech((prev) =>
      prev.length === filteredTech.length ? [] : filteredTech
    );
  }, [filteredTech]);

  return {
    // State
    selectedTech,
    setSelectedTech,
    perLine,
    setPerLine,
    generatedMarkdown,
    isCopied,
    includeTitle,
    setIncludeTitle,
    searchKeyword,
    setSearchKeyword,
    // Computed
    filteredTech,
    selectedTechSet,
    selectedIconIds,
    // Actions
    generateMarkdown,
    copyToClipboard,
    handleTechToggle,
    handleSelectAll,
  };
};
