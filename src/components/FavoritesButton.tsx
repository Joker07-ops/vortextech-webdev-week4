import { useFavoritesContext } from "@/context/FavoritesContext";
import styles from "./FavoritesButton.module.css";

interface Props {
  pokemonId: number;
  size?: "sm" | "md";
}

export default function FavoritesButton({ pokemonId, size = "md" }: Props) {
  const { isFavorited, toggle } = useFavoritesContext();
  const active = isFavorited(pokemonId);

  return (
    <button
      type="button"
      className={`${styles.btn} ${styles[size]} ${active ? styles.active : ""}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(pokemonId);
      }}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      title={active ? "Remove from favorites" : "Add to favorites"}
    >
      <span className={styles.heart} aria-hidden="true">
        {active ? "\u2764\uFE0F" : "\uD83E\uDDE1"}
      </span>
    </button>
  );
}
