import type { TechItem } from "@/types/tech";

interface UseTechSelectionProps {
  selectedTech: TechItem[];
  setSelectedTech: (
    updater: TechItem[] | ((prev: TechItem[]) => TechItem[])
  ) => void;
  filteredTech: TechItem[];
}

interface UseTechSelectionReturn {
  selectedTechSet: Set<string>;
  selectedIconIds: string[];
  handleTechToggle: (tech: TechItem) => void;
  handleSelectAll: () => void;
}

/**
 * Hook for managing tech selection actions
 * Provides computed sets and toggle handlers
 */
export function useTechSelection({
  selectedTech,
  setSelectedTech,
  filteredTech,
}: UseTechSelectionProps): UseTechSelectionReturn {
  const selectedTechSet = new Set(selectedTech.map((tech) => tech.id));
  const selectedIconIds = selectedTech.map((tech) => tech.id);

  const handleTechToggle = (tech: TechItem) => {
    setSelectedTech((prev) =>
      prev.some((item) => item.id === tech.id)
        ? prev.filter((item) => item.id !== tech.id)
        : [...prev, tech]
    );
  };

  const handleSelectAll = () => {
    setSelectedTech((prev) =>
      prev.length === filteredTech.length ? [] : filteredTech
    );
  };

  return {
    selectedTechSet,
    selectedIconIds,
    handleTechToggle,
    handleSelectAll,
  };
}
