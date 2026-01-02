import { useState } from "react";
import { toast } from "@/lib/use-toast";
import type { TechItem } from "@/types/tech";
import { TECH_STACK } from "@/data/tech-stack-data";

interface UseMarkdownGeneratorProps {
  selectedTech: TechItem[];
  includeTitle: boolean;
  title: string;
}

interface UseMarkdownGeneratorReturn {
  generatedMarkdown: string;
  isCopied: boolean;
  generateMarkdown: () => void;
  copyToClipboard: () => void;
}

/**
 * Hook for generating and copying markdown output
 * Manages markdown generation state and clipboard operations
 */
export function useMarkdownGenerator({
  selectedTech,
  includeTitle,
  title,
}: UseMarkdownGeneratorProps): UseMarkdownGeneratorReturn {
  const [generatedMarkdown, setGeneratedMarkdown] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);

  const generateMarkdown = () => {
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

    const titleSection = includeTitle && title !== "All" ? `### ${title}\n\n` : "";
    const markdown = `${titleSection}<p align="center">\n  ${icons}\n</p>`;
    setGeneratedMarkdown(markdown);
  };

  const copyToClipboard = () => {
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
  };

  return {
    generatedMarkdown,
    isCopied,
    generateMarkdown,
    copyToClipboard,
  };
}
