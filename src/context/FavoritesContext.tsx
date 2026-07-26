import { createContext, useContext } from "react";
import { useFavorites } from "@/hooks/useFavorites";

interface FavoritesContextValue {
  favorites: Set<number>;
  toggle: (id: number) => void;
  isFavorited: (id: number) => boolean;
  count: number;
}

export const FavoritesContext = createContext<FavoritesContextValue | null>(
  null,
);

export function useFavoritesContext() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavoritesContext must be inside FavoritesProvider");
  return ctx;
}

export { useFavorites };
