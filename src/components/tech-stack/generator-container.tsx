"use client";

import React from "react";
import { useQueryState, parseAsString } from "nuqs";
import IconGridGenerator from "./icon-grid-generator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TAB_CONFIGS, DEFAULT_TAB } from "@/lib/tech-stack/tab-config";

export default function GeneratorContainer() {
  const [activeTab, setActiveTab] = useQueryState(
    "tab",
    parseAsString.withDefault(DEFAULT_TAB)
  );

  return (
    <div className="w-full min-h-screen">
      <div className="px-4 sm:px-6 lg:px-8 py-3 md:py-4 space-y-3">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <ScrollArea className="whitespace-nowrap pb-3 rounded-md">
            <TabsList className="w-full">
              {TAB_CONFIGS.map(({ title }) => (
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
          {TAB_CONFIGS.map((props) => {
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
