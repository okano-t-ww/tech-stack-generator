import { Button } from "@/components/ui/button";
import TechIconGrid from "./tech-icon-grid";
import type { TechItem } from "@/types/tech";

type PerLine = 5 | 6 | 7 | 8 | 9 | 10;

interface PreviewPanelProps {
  selectedIconIds: string[];
  perLine: PerLine;
  selectedTech: TechItem[];
  onSelectedTechChange: (tech: TechItem[]) => void;
  onGenerate: () => void;
  disabled: boolean;
}

export const PreviewPanel = ({
  selectedIconIds,
  perLine,
  selectedTech,
  onSelectedTechChange,
  onGenerate,
  disabled,
}: PreviewPanelProps) => {
  return (
    <div className="xl:col-span-5 space-y-2">
      <label className="form-label">Preview & Reorder</label>
      <div className="min-h-[400px] p-4 border-2 border-dashed border-border/50 rounded-xl bg-gradient-to-b from-muted/20 to-transparent">
        <TechIconGrid
          iconIds={selectedIconIds}
          perLine={perLine}
          selectedTech={selectedTech}
          setSelectedTech={onSelectedTechChange}
        />
      </div>
      <Button
        onClick={onGenerate}
        className="w-full h-10 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 relative overflow-hidden group"
        disabled={disabled}
      >
        <span className="relative z-10">Generate Markdown</span>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </Button>
    </div>
  );
};
