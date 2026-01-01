import type { TechItem, TechCategory } from "@/types/tech";
import { getTabPrefix } from "@/lib/tech-stack/tab-config";
import { useTabUrlState } from "./use-tab-url-state";
import { useTechFiltering } from "./use-tech-filtering";
import { useTechSelection } from "./use-tech-selection";
import { useMarkdownGenerator } from "./use-markdown-generator";
import type { PerLine } from "./url-state-parsers";

interface UseIconGridGeneratorProps {
  title: string;
  techList: TechItem[];
  categories: TechCategory[];
}

interface UseIconGridGeneratorReturn {
  // URL-synced state
  selectedTech: TechItem[];
  setSelectedTech: (
    updater: TechItem[] | ((prev: TechItem[]) => TechItem[])
  ) => void;
  perLine: PerLine;
  setPerLine: (value: PerLine) => void;
  includeTitle: boolean;
  setIncludeTitle: (value: boolean) => void;
  // Local state
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
  generatedMarkdown: string;
  isCopied: boolean;
  // Computed
  filteredTech: TechItem[];
  selectedTechSet: Set<string>;
  selectedIconIds: string[];
  // Actions
  generateMarkdown: () => void;
  copyToClipboard: () => void;
  handleTechToggle: (tech: TechItem) => void;
  handleSelectAll: () => void;
}

/**
 * Main hook for icon grid generator
 * Composes smaller, focused hooks for URL state, filtering, selection, and markdown generation
 */
export const useIconGridGenerator = ({
  title,
  techList,
  categories,
}: UseIconGridGeneratorProps): UseIconGridGeneratorReturn => {
  const tabPrefix = getTabPrefix(title);

  if (!tabPrefix) {
    throw new Error(`Invalid tab title: ${title}`);
  }

  // URL-synced state management
  const { state, selectedTech, setSelectedTech, setPerLine, setIncludeTitle } =
    useTabUrlState(tabPrefix);

  // Tech filtering (local state)
  const { filteredTech, searchKeyword, setSearchKeyword } = useTechFiltering({
    techList,
    categories,
  });

  // Tech selection actions
  const {
    selectedTechSet,
    selectedIconIds,
    handleTechToggle,
    handleSelectAll,
  } = useTechSelection({
    selectedTech,
    setSelectedTech,
    filteredTech,
  });

  // Markdown generation
  const { generatedMarkdown, isCopied, generateMarkdown, copyToClipboard } =
    useMarkdownGenerator({
      selectedTech,
      includeTitle: state.includeTitle,
      title,
    });

  return {
    // URL-synced state
    selectedTech,
    setSelectedTech,
    perLine: state.perLine,
    setPerLine,
    includeTitle: state.includeTitle,
    setIncludeTitle,
    // Local state
    searchKeyword,
    setSearchKeyword,
    generatedMarkdown,
    isCopied,
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
