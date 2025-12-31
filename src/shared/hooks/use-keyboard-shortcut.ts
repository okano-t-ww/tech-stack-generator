import { useEffect } from "react";

interface KeyboardShortcutOptions {
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
}

export const useKeyboardShortcut = (
  key: string,
  callback: () => void,
  options?: KeyboardShortcutOptions
) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const requiresCtrlOrMeta = options?.ctrl || options?.meta;
      const matchesModifier = requiresCtrlOrMeta
        ? e.ctrlKey || e.metaKey
        : true;
      const matchesShift = options?.shift ? e.shiftKey : !e.shiftKey;

      if (e.key === key && matchesModifier && matchesShift) {
        e.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [key, callback, options]);
};
