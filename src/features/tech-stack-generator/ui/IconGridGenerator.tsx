"use client";

import type { TechItem, TechCategory } from "@/entities/tech";
import { useIconGridGenerator } from "../model/useIconGridGenerator";
import { PreviewControls } from "./PreviewControls";
import { TechSelectionPanel } from "./TechSelectionPanel";
import { PreviewPanel } from "./PreviewPanel";
import { MarkdownOutputPanel } from "./MarkdownOutputPanel";

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
  const {
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
    filteredTech,
    selectedTechSet,
    selectedIconIds,
    generateMarkdown,
    copyToClipboard,
    handleTechToggle,
    handleSelectAll,
  } = useIconGridGenerator({ title, techList, categories });

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <span className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent"></span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:justify-between items-start sm:items-center border-b border-border/30 pb-2">
          <PreviewControls
            perLine={perLine}
            onPerLineChange={setPerLine}
            includeTitle={includeTitle}
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
            perLine={perLine}
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
