import { useCallback, useMemo } from "react";
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
  const selectedTechSet = useMemo(
    () => new Set(selectedTech.map((tech) => tech.id)),
    [selectedTech]
  );

  const selectedIconIds = useMemo(
    () => selectedTech.map((tech) => tech.id),
    [selectedTech]
  );

  const handleTechToggle = useCallback(
    (tech: TechItem) => {
      setSelectedTech((prev) =>
        prev.some((item) => item.id === tech.id)
          ? prev.filter((item) => item.id !== tech.id)
          : [...prev, tech]
      );
    },
    [setSelectedTech]
  );

  const handleSelectAll = useCallback(() => {
    setSelectedTech((prev) =>
      prev.length === filteredTech.length ? [] : filteredTech
    );
  }, [filteredTech, setSelectedTech]);

  return {
    selectedTechSet,
    selectedIconIds,
    handleTechToggle,
    handleSelectAll,
  };
}
