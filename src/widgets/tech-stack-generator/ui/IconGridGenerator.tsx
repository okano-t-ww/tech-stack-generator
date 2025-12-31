"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { toast } from "@/shared/hooks/use-toast";
import { Copy, Check, CheckSquare, SquareMinus, Square } from "lucide-react";
import { Toggle } from "@/shared/ui/toggle";
import { Combobox } from "@/shared/ui/components/Combobox";
import { TooltipIconButton } from "@/shared/ui/components/TooltipIconButton";
import TechIconGrid from "./TechIconGrid";
import { TECH_STACK, type TechItem, type TechCategory } from "@/entities/tech";

type PerLine = 5 | 6 | 7 | 8 | 9 | 10;

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
  const [selectedTech, setSelectedTech] = useState<TechItem[]>([]);
  const [perLine, setPerLine] = useState<PerLine>(10);
  const [generatedMarkdown, setGeneratedMarkdown] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);

  const filteredTech = techList.filter((tech) =>
    categories.includes(tech.category)
  );

  // Performance: O(1) lookup instead of O(n) - keep this optimization
  const selectedTechSet = new Set(selectedTech.map((tech) => tech.id));

  const getSelectAllIcon = () => {
    switch (selectedTech.length) {
      case 0:
        return Square;
      case filteredTech.length:
        return CheckSquare;
      default:
        return SquareMinus;
    }
  };

  const selectedIconIds = selectedTech.map((tech) => tech.id);

  const generateMarkdown = () => {
    const iconSize = 48;
    const icons = selectedTech
      .map((tech) => {
        const techData = TECH_STACK[tech.id as keyof typeof TECH_STACK];
        const iconifyId = techData?.iconify || `logos:${tech.id}`;
        const iconUrl = `https://api.iconify.design/${iconifyId}.svg?width=${iconSize}&height=${iconSize}`;
        const link = (techData && 'link' in techData ? techData.link : undefined) || `https://simpleicons.org/?q=${encodeURIComponent(tech.name)}`;
        return `<a href="${link}" target="_blank" rel="noopener noreferrer"><img src="${iconUrl}" alt="${tech.name}" width="${iconSize}" height="${iconSize}" /></a>`;
      })
      .join(" ");

    const markdown = `<p align="center">\n  ${icons}\n</p>`;
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

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <span className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent"></span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:justify-between items-start sm:items-center border-b border-border/30 pb-2">
          <div className="flex flex-row gap-2 items-center">
            <label className="form-label">Preview</label>
            <Combobox
              items={[
                { value: "5", label: "5" },
                { value: "6", label: "6" },
                { value: "7", label: "7" },
                { value: "8", label: "8" },
                { value: "9", label: "9" },
                { value: "10", label: "10" },
              ]}
              placeholder="per line"
              defaultValue="10"
              disableSearch
              onSelect={(value) => {
                setPerLine(Number(value) as PerLine);
              }}
              width="120px"
              height="25px"
            />
          </div>
          <div>
            <TooltipIconButton
              onClick={handleSelectAll}
              icon={getSelectAllIcon()}
              tooltipText="Select All"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3">
          {/* Left Column: Tech Selection Toggles */}
          <div className="xl:col-span-2 space-y-2">
            <label className="form-label">Technologies</label>
            <div className="flex flex-row flex-wrap gap-1 max-h-[600px] overflow-y-auto p-2 border border-border/30 rounded-lg bg-muted/20">
              {filteredTech.map((tech) => (
                <Toggle
                  key={tech.id}
                  onClick={() => handleTechToggle(tech)}
                  pressed={selectedTechSet.has(tech.id)}
                  className="text-xs"
                >
                  {tech.name}
                </Toggle>
              ))}
            </div>
          </div>

          {/* Center Column: Preview with DnD */}
          <div className="xl:col-span-5 space-y-2">
            <label className="form-label">Preview & Reorder</label>
            <div className="min-h-[400px] p-4 border-2 border-dashed border-border/50 rounded-xl bg-gradient-to-b from-muted/20 to-transparent">
              <TechIconGrid
                iconIds={selectedIconIds}
                perLine={perLine}
                selectedTech={selectedTech}
                setSelectedTech={setSelectedTech}
              />
            </div>
            <Button
              onClick={generateMarkdown}
              className="w-full h-10 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 relative overflow-hidden group"
              disabled={!selectedTech.length}
            >
              <span className="relative z-10">Generate Markdown</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Button>
          </div>

          {/* Right Column: Generated Output */}
          <div className="xl:col-span-5 space-y-2">
            <label className="form-label">Generated Output</label>
            {generatedMarkdown ? (
              <div className="space-y-2">
                <div className="border-2 border-primary/20 rounded-xl p-4 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-1 w-1 rounded-full bg-primary"></div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preview</span>
                  </div>
                  <div
                    dangerouslySetInnerHTML={{ __html: generatedMarkdown }}
                    className="flex items-center justify-center [&_a]:inline-block"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    value={generatedMarkdown}
                    readOnly
                    className="font-mono text-xs"
                  />
                  <Button size="icon" onClick={copyToClipboard}>
                    {isCopied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-[400px] flex items-center justify-center border-2 border-dashed border-border/30 rounded-xl bg-muted/10">
                <p className="text-sm text-muted-foreground">Generate markdown to see output</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
