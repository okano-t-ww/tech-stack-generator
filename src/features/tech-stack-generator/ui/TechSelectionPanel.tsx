import { IconToggle } from "@/shared/ui/icon-toggle";
import { TooltipIconButton } from "@/shared/ui/components/TooltipIconButton";
import { Input } from "@/shared/ui/input";
import type { TechItem } from "@/entities/tech";
import { useTechSelectionData } from "../model/useTechSelectionData";

interface TechSelectionPanelProps {
  filteredTech: TechItem[];
  selectedTechSet: Set<string>;
  onTechToggle: (tech: TechItem) => void;
  onSelectAll: () => void;
  selectedCount: number;
  searchKeyword: string;
  onSearchChange: (value: string) => void;
}

export const TechSelectionPanel = (props: TechSelectionPanelProps) => {
  const { selectAllIcon, toggleItems, onSelectAll } = useTechSelectionData(props);

  return (
    <div className="xl:col-span-2 space-y-2">
      <div className="flex items-center justify-between">
        <label className="form-label">Technologies</label>
        <TooltipIconButton
          onClick={onSelectAll}
          icon={selectAllIcon}
          tooltipText="Select All"
        />
      </div>
      <Input
        placeholder="Search technologies..."
        value={props.searchKeyword}
        onChange={(e) => props.onSearchChange(e.target.value)}
        className="h-9 text-sm"
      />
      <div className="flex flex-row flex-wrap gap-2 max-h-[600px] overflow-y-auto p-2 border border-border/30 rounded-lg bg-muted/20">
        {toggleItems.map((item) => (
          <IconToggle
            key={item.id}
            icon={item.icon}
            label={item.label}
            pressed={item.isSelected}
            onClick={item.onToggle}
          />
        ))}
      </div>
    </div>
  );
};
