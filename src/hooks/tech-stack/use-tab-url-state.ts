import { useCallback, useMemo } from "react";
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
  setSelectedTech: (
    updater: TechItem[] | ((prev: TechItem[]) => TechItem[])
  ) => void;
  setPerLine: (value: PerLine) => void;
  setIncludeTitle: (value: boolean) => void;
}

/**
 * Hook for managing tab-specific URL state
 * Handles URL synchronization for selected tech, perLine, and includeTitle
 */
export function useTabUrlState(tabPrefix: TabPrefix): UseTabUrlStateReturn {
  const urlParsers = useMemo(() => createTabParsers(tabPrefix), [tabPrefix]);

  const [urlState, setUrlState] = useQueryStates(urlParsers, {
    history: "push",
    shallow: true,
  });

  const state = useMemo(
    () => extractTabUrlState(urlState, tabPrefix),
    [urlState, tabPrefix]
  );

  // Hydrate selectedTech from URL IDs
  const selectedTech = useMemo(() => {
    return state.selected
      .map((id) => TECH_STACK[id as keyof typeof TECH_STACK])
      .filter(Boolean) as TechItem[];
  }, [state.selected]);

  // Setters that update URL state
  const setSelectedTech = useCallback(
    (updater: TechItem[] | ((prev: TechItem[]) => TechItem[])) => {
      const newTech =
        typeof updater === "function" ? updater(selectedTech) : updater;
      const newIds = newTech.map((tech) => tech.id);
      setUrlState({ [`${tabPrefix}_selected`]: newIds });
    },
    [selectedTech, tabPrefix, setUrlState]
  );

  const setPerLine = useCallback(
    (value: PerLine) => {
      const validValue = clampPerLine(value);
      setUrlState({ [`${tabPrefix}_perLine`]: validValue });
    },
    [tabPrefix, setUrlState]
  );

  const setIncludeTitle = useCallback(
    (value: boolean) => {
      setUrlState({ [`${tabPrefix}_includeTitle`]: value });
    },
    [tabPrefix, setUrlState]
  );

  return {
    state,
    selectedTech,
    setSelectedTech,
    setPerLine,
    setIncludeTitle,
  };
}
