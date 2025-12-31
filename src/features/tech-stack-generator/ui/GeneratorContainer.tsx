"use client";

import React from "react";
import { TECH_STACK_LIST, TechCategory } from "@/entities/tech";
import IconGridGenerator, {
  type IconGridGeneratorProps,
} from "./IconGridGenerator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { ScrollArea, ScrollBar } from "@/shared/ui/scroll-area";

export default function GeneratorContainer() {
  const generatorPropsList: IconGridGeneratorProps[] = [
    {
      title: "Languages",
      techList: TECH_STACK_LIST,
      categories: [TechCategory.Language],
    },
    {
      title: "Frameworks & Libraries",
      techList: TECH_STACK_LIST,
      categories: [TechCategory.Framework, TechCategory.Library],
    },
    {
      title: "Platforms & Cloud",
      techList: TECH_STACK_LIST,
      categories: [TechCategory.Platform, TechCategory.Cloud],
    },
    {
      title: "Databases",
      techList: TECH_STACK_LIST,
      categories: [TechCategory.Database],
    },
    {
      title: "DevOps & Build Tools",
      techList: TECH_STACK_LIST,
      categories: [
        TechCategory.CICD,
        TechCategory.BuildTool,
        TechCategory.Testing,
        TechCategory.Monitoring,
      ],
    },
    {
      title: "Design & Editors",
      techList: TECH_STACK_LIST,
      categories: [TechCategory.Design, TechCategory.Editor],
    },
    {
      title: "Message Queues",
      techList: TECH_STACK_LIST,
      categories: [TechCategory.MessageQueue],
    },
    {
      title: "Other",
      techList: TECH_STACK_LIST,
      categories: [TechCategory.Other],
    },
    {
      title: "All",
      techList: TECH_STACK_LIST,
      categories: Object.values(TechCategory),
    },
  ];

  return (
    <div className="w-full min-h-screen">
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
