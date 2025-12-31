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
      title: "Frameworks | Libraries",
      techList: filteredTech,
      categories: [TechCategory.Framework, TechCategory.Library],
    },
    {
      title: "Platforms",
      techList: filteredTech,
      categories: [TechCategory.Platform],
    },
    {
      title: "Cloud",
      techList: filteredTech,
      categories: [TechCategory.Cloud],
    },
    {
      title: "Database | CI/CD | BuildTool",
      techList: filteredTech,
      categories: [
        TechCategory.Database,
        TechCategory.CICD,
        TechCategory.BuildTool,
      ],
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
    <div className="w-full min-h-screen px-4 sm:px-6 md:max-w-6xl md:mx-auto py-6 md:py-8 space-y-6 md:space-y-8">
      <div className="space-y-4">
        <Input
          id="techs"
          placeholder="Search technologies..."
          onChange={handleSearchTech}
          className="h-11 text-base"
        />
      </div>
      <div className="space-y-6">
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
