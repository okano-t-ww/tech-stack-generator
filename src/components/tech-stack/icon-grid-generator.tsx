"use client";

import type { TechItem, TechCategory } from "@/types/tech";
import { getTabPrefix } from "@/lib/tech-stack/tab-config";
import { useTabUrlState } from "@/hooks/tech-stack/use-tab-url-state";
import { useTechFiltering } from "@/hooks/tech-stack/use-tech-filtering";
import { useTechSelection } from "@/hooks/tech-stack/use-tech-selection";
import { useMarkdownGenerator } from "@/hooks/tech-stack/use-markdown-generator";
import { PreviewControls } from "./preview-controls";
import { TechSelectionPanel } from "./tech-selection-panel";
import { PreviewPanel } from "./preview-panel";
import { MarkdownOutputPanel } from "./markdown-output-panel";

export interface IconGridGeneratorProps {
  title: string;
  techList: TechItem[];
  categories: TechCategory[];
}

export default function IconGridGenerator({
  title,
  techList,
  categories,
}: IconGridGeneratorProps) {
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

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <span className="h-px flex-1 bg-linear-to-r from-primary/30 to-transparent"></span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:justify-between items-start sm:items-center border-b border-border/30 pb-2">
          <PreviewControls
            perLine={state.perLine}
            onPerLineChange={setPerLine}
            includeTitle={state.includeTitle}
            onIncludeTitleChange={setIncludeTitle}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3">
          {/* Left Column: Tech Selection Toggles */}
          <TechSelectionPanel
            filteredTech={filteredTech}
            selectedTechSet={selectedTechSet}
            onTechToggle={handleTechToggle}
            onSelectAll={handleSelectAll}
            selectedCount={selectedTech.length}
            searchKeyword={searchKeyword}
            onSearchChange={setSearchKeyword}
          />

          {/* Center Column: Preview with DnD */}
          <PreviewPanel
            selectedIconIds={selectedIconIds}
            perLine={state.perLine}
            selectedTech={selectedTech}
            onSelectedTechChange={setSelectedTech}
            onGenerate={generateMarkdown}
            disabled={!selectedTech.length}
          />

          {/* Right Column: Generated Output */}
          <MarkdownOutputPanel
            generatedMarkdown={generatedMarkdown}
            isCopied={isCopied}
            onCopy={copyToClipboard}
          />
        </div>
      </div>
    </div>
  );
}
