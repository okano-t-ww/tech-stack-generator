"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Copy, Moon, Sun, CheckSquare, SquareMinus, Square } from "lucide-react";
import React from "react";
import { Toggle } from "@/components/ui/toggle";
import { Switch } from "@/components/ui/switch";
import { Combobox } from "@/components/utils/Combobox";
import { TooltipIconButton } from "@/components/utils/TooltipIconButton";
import TechIconGrid from "@/components/generator/TechIconGrid";
import { DndList } from "@/components/utils/DndList";
import { getTechLink } from "@/lib/techLinks";
import type { TechItem, IconTheme, PerLine, TechCategory } from "@/types/tech";

export interface IconGridGeneratorProps {
  title: string;
  techList: TechItem[];
  categories: TechCategory[];
}

type OutputFormat = "single" | "individual";

export default function IconGridGenerator({
  title,
  techList,
  categories,
}: IconGridGeneratorProps) {
  const [selectedTech, setSelectedTech] = useState<TechItem[]>([]);
  const [theme, setTheme] = useState<IconTheme>("dark");
  const [perLine, setPerLine] = useState<PerLine>(10);
  const [generatedMarkdown, setGeneratedMarkdown] = useState<string>("");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("single");

  const filteredTech = techList.filter((tech) =>
    categories.includes(tech.category)
  );

  const getSelectAllIcon = useMemo(() => {
    switch (selectedTech.length) {
      case 0:
        return Square;
      case filteredTech.length:
        return CheckSquare;
      default:
        return SquareMinus;
    }
  }, [selectedTech.length, filteredTech.length]);

  const selectedIconIds = selectedTech.map((tech) => tech.id);

  const generateMarkdown = () => {
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://tech-stack-generator.vercel.app";

    let markdown = "";

    if (outputFormat === "single") {
      // 1つの画像として生成
      const iconIds = selectedTech.map((tech) => tech.id).join(",");
      const imageUrl = `${baseUrl}/api/icons?i=${iconIds}&theme=${theme}&perline=${perLine}`;
      markdown = `![${title}](${imageUrl})`;
    } else {
      const iconSize = 48;
      const icons = selectedTech
        .map((tech) => {
          const iconUrl = `${baseUrl}/api/icon?i=${tech.id}&theme=${theme}&size=${iconSize}`;
          const link = getTechLink(tech.id, tech.name);
          return `<a href="${link}" target="_blank" rel="noopener noreferrer"><img src="${iconUrl}" alt="${tech.name}" width="${iconSize}" height="${iconSize}" /></a>`;
        })
        .join(" ");

      markdown = `<p align="center">${icons}</p>`;
    }

    setGeneratedMarkdown(markdown);
  };

  const copyToClipboard = () => {
    if (!generatedMarkdown) {
      toast({
        title: "Markdownが生成されていません",
        description: "先に「Generate」ボタンを押してください",
        variant: "destructive",
      });
      return;
    }

    navigator.clipboard
      .writeText(generatedMarkdown)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "Markdownがクリップボードにコピーされました",
        });
      })
      .catch(() => {
        toast({
          title: "Copy failed",
          description: "もう一度お試しください",
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
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="text-3xl font-bold">{title}</div>

        <div className="space-y-2">
          <div className="flex flex-row gap-2 items-center">
            <div className="text-sm font-medium">Output Format:</div>
            <Combobox
              items={[
                { value: "single", label: "Single Image" },
                { value: "individual", label: "Individual Icons (with links)" },
              ]}
              placeholder="Format"
              defaultValue="single"
              disableSearch
              onSelect={(value) => {
                setOutputFormat(value as OutputFormat);
              }}
              width="220px"
              height="25px"
            />
          </div>

          <div className="flex flex-row gap-2 justify-between">
            <div className="flex flex-row gap-2 items-center">
              <div className="text-sm">Preview</div>
              <Switch
                id="theme-switch"
                checked={theme === "dark"}
                uncheckedIcon={<Sun />}
                checkedIcon={<Moon />}
                onCheckedChange={() =>
                  setTheme(theme === "dark" ? "light" : "dark")
                }
              />
              {outputFormat === "single" && (
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
              )}
            </div>
            <div>
              <TooltipIconButton
                onClick={handleSelectAll}
                icon={getSelectAllIcon}
                tooltipText="Select All"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-2">
          <div className="flex-1">
            <div className="min-h-20 p-3 flex items-center justify-center border rounded-lg bg-muted">
              <TechIconGrid
                iconIds={selectedIconIds}
                theme={theme}
                perLine={perLine}
              />
            </div>

            <div className="flex flex-row flex-wrap justify-center mt-4">
              {filteredTech.map((tech) => (
                <Toggle
                  key={tech.id}
                  onClick={() => handleTechToggle(tech)}
                  className="m-1"
                  pressed={selectedTech.some((item) => item.id === tech.id)}
                >
                  {tech.name}
                </Toggle>
              ))}
            </div>

            <Button
              onClick={generateMarkdown}
              className="w-full mt-6"
              disabled={!selectedTech.length}
            >
              Generate Markdown
            </Button>

            {generatedMarkdown && (
              <div className="space-y-4 mt-4">
                <div className="border rounded-lg p-4 bg-muted">
                  <div className="text-sm font-medium mb-2">Preview:</div>
                  {outputFormat === "single" ? (
                    <div className="flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={generatedMarkdown.match(/\(([^)]+)\)/)?.[1] || ""}
                        alt={title}
                        className="max-w-full h-auto"
                      />
                    </div>
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{ __html: generatedMarkdown }}
                      className="flex items-center justify-center"
                    />
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    value={generatedMarkdown}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button size="icon" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="w-full max-w-sm">
            <DndList
              items={selectedTech}
              setItems={setSelectedTech}
              getItemId={(tech) => tech.id}
              renderItem={(tech) => tech.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
