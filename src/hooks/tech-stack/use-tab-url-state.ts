import { useQueryStates } from "nuqs";
import type { TechItem } from "@/types/tech";
import { TECH_STACK } from "@/data/tech-stack-data";
import type { TabPrefix } from "@/lib/tech-stack/tab-config";
import {
  createTabParsers,
  extractTabUrlState,
  clampPerLine,
  type PerLine,
  type TabUrlState,
} from "./url-state-parsers";

interface UseTabUrlStateReturn {
  state: TabUrlState;
  selectedTech: TechItem[];
  setSelectedTech: (updater: TechItem[] | ((prev: TechItem[]) => TechItem[])) => void;
  setPerLine: (value: PerLine) => void;
  setIncludeTitle: (value: boolean) => void;
}

/**
 * Hook for managing tab-specific URL state
 * Handles URL synchronization for selected tech, perLine, and includeTitle
 */
export function useTabUrlState(tabPrefix: TabPrefix): UseTabUrlStateReturn {
  const urlParsers = createTabParsers(tabPrefix);

  const [urlState, setUrlState] = useQueryStates(urlParsers, {
    history: "push",
    shallow: true,
  });

  const state = extractTabUrlState(urlState, tabPrefix);

  // Hydrate selectedTech from URL IDs
  const selectedTech = state.selected
    .map((id) => TECH_STACK[id as keyof typeof TECH_STACK])
    .filter(Boolean) as TechItem[];

  // Setters that update URL state
  const setSelectedTech = (updater: TechItem[] | ((prev: TechItem[]) => TechItem[])) => {
    const newTech = typeof updater === "function" ? updater(selectedTech) : updater;
    const newIds = newTech.map((tech) => tech.id);
    setUrlState({ [`${tabPrefix}_selected`]: newIds });
  };

  const setPerLine = (value: PerLine) => {
    const validValue = clampPerLine(value);
    setUrlState({ [`${tabPrefix}_perLine`]: validValue });
  };

  const setIncludeTitle = (value: boolean) => {
    setUrlState({ [`${tabPrefix}_includeTitle`]: value });
  };

  return {
    state,
    selectedTech,
    setSelectedTech,
    setPerLine,
    setIncludeTitle,
  };
}
