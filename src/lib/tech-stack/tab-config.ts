import type { IconGridGeneratorProps } from "@/components/tech-stack/icon-grid-generator";
import { TechCategory } from "@/types/tech";
import { TECH_STACK_LIST } from "@/data/tech-stack-data";

export const TAB_PREFIXES = {
  Languages: "lang",
  "Frameworks & Libraries": "framework",
  "Platforms & Cloud": "platform",
  Databases: "db",
  "DevOps & Build Tools": "devops",
  "Design & Editors": "design",
  "Message Queues": "queue",
  Other: "other",
  All: "all",
} as const;

export type TabTitle = keyof typeof TAB_PREFIXES;
export type TabPrefix = (typeof TAB_PREFIXES)[TabTitle];

export function getTabPrefix(title: string): TabPrefix | undefined {
  return TAB_PREFIXES[title as TabTitle];
}

export const TAB_CONFIGS: IconGridGeneratorProps[] = [
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

export const DEFAULT_TAB = TAB_CONFIGS[0].title;
