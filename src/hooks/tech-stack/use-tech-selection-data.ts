import { useMemo } from "react";
import { CheckSquare, SquareMinus, Square, type LucideIcon } from "lucide-react";
import type { TechItem } from "@/types/tech";
import { TECH_STACK } from "@/data/tech-stack-data";

export interface TechToggleItem {
  id: string;
  icon: string;
  label: string;
  isSelected: boolean;
  onToggle: () => void;
}

interface UseTechSelectionDataProps {
  filteredTech: TechItem[];
  selectedTechSet: Set<string>;
  onTechToggle: (tech: TechItem) => void;
  onSelectAll: () => void;
  selectedCount: number;
}

export const useTechSelectionData = ({
  filteredTech,
  selectedTechSet,
  onTechToggle,
  onSelectAll,
  selectedCount,
}: UseTechSelectionDataProps) => {
  const selectAllIcon: LucideIcon = useMemo(() => {
    if (selectedCount === 0) return Square;
    if (selectedCount === filteredTech.length) return CheckSquare;
    return SquareMinus;
  }, [selectedCount, filteredTech.length]);

  const toggleItems: TechToggleItem[] = useMemo(
    () =>
      filteredTech.map((tech) => {
        const techData = TECH_STACK[tech.id as keyof typeof TECH_STACK];
        const iconifyId = techData?.iconify || `logos:${tech.id}`;

        return {
          id: tech.id,
          icon: iconifyId,
          label: tech.name,
          isSelected: selectedTechSet.has(tech.id),
          onToggle: () => onTechToggle(tech),
        };
      }),
    [filteredTech, selectedTechSet, onTechToggle]
  );

  return {
    selectAllIcon,
    toggleItems,
    onSelectAll,
  };
};
