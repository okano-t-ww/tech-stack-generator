"use client";

import { useState } from "react";
import { Input } from "@/shared/ui/input";
import React from "react";
import { TECH_STACK_LIST, TechCategory } from "@/entities/tech";
import IconGridGenerator, {
  type IconGridGeneratorProps,
} from "./IconGridGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { ScrollArea, ScrollBar } from "@/shared/ui/scroll-area";
import { useDebouncedCallback } from "use-debounce";

export default function GeneratorContainer() {
  const [filteredTech, setFilteredTech] = useState(TECH_STACK_LIST);

  const handleSearchTech = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const keyword = value.toLowerCase();
      setFilteredTech(
        TECH_STACK_LIST.filter((tech) =>
          tech.name.toLowerCase().includes(keyword)
        )
      );
    },
    300
  );

  const generatorPropsList: IconGridGeneratorProps[] = [
    {
      title: "Languages",
      techList: filteredTech,
      categories: [TechCategory.Language],
    },
    {
      title: "Frameworks & Libraries",
      techList: filteredTech,
      categories: [TechCategory.Framework, TechCategory.Library],
    },
    {
      title: "Platforms & Cloud",
      techList: filteredTech,
      categories: [TechCategory.Platform, TechCategory.Cloud],
    },
    {
      title: "Databases",
      techList: filteredTech,
      categories: [TechCategory.Database],
    },
    {
      title: "DevOps & Build Tools",
      techList: filteredTech,
      categories: [
        TechCategory.CICD,
        TechCategory.BuildTool,
        TechCategory.Testing,
        TechCategory.Monitoring,
      ],
    },
    {
      title: "Design & Editors",
      techList: filteredTech,
      categories: [TechCategory.Design, TechCategory.Editor],
    },
    {
      title: "Message Queues",
      techList: filteredTech,
      categories: [TechCategory.MessageQueue],
    },
    {
      title: "Other",
      techList: filteredTech,
      categories: [TechCategory.Other],
    },
    {
      title: "All",
      techList: filteredTech,
      categories: Object.values(TechCategory),
    },
  ];

  return (
    <div className="w-full min-h-screen">
      {/* Floating Search Input */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border/40 px-4 sm:px-6 lg:px-8 py-3">
        <Input
          id="techs"
          placeholder="Search technologies..."
          onChange={handleSearchTech}
          className="h-9 text-sm max-w-md"
        />
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-3 md:py-4 space-y-3">
        <Tabs defaultValue={generatorPropsList[0].title}>
          <ScrollArea className="whitespace-nowrap pb-3 rounded-md">
            <TabsList className="w-full">
              {generatorPropsList.map(({ title }) => (
                <TabsTrigger
                  key={title}
                  value={title}
                  className="whitespace-nowrap"
                >
                  {title}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          {generatorPropsList.map((props) => {
            const { title } = props;
            return (
              <TabsContent key={title} value={title}>
                <div className="card-section">
                  <IconGridGenerator key={title} {...props} />
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}
