import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) return JSON.parse(stored) as T;
    } catch {
      /* ignore corrupt storage */
    }
    return typeof initialValue === "function" ? (initialValue as () => T)() : initialValue;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore quota errors */
    }
  }, [key, value]);

  return [value, setValue] as const;
}
