import { useState, useEffect } from "react";
import { StorageService } from "../services/storage.service";

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    return StorageService.get(key, defaultValue);
  });

  useEffect(() => {
    StorageService.set(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}
