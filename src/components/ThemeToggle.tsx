import { useThemeContext } from "@/context/ThemeContext";
import styles from "./ThemeToggle.module.css";

export default function ThemeToggle() {
  const { theme, toggle } = useThemeContext();

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <span className={styles.icon} aria-hidden="true">
        {theme === "dark" ? "\u2600\uFE0F" : "\uD83C\uDF19"}
      </span>
    </button>
  );
}
