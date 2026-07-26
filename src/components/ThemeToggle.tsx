import { useThemeContext } from "@/context/ThemeContext";
import { SunIcon, MoonIcon } from "@/components/Icons";
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
        {theme === "dark" ? <SunIcon size={18} /> : <MoonIcon size={18} />}
      </span>
    </button>
  );
}
