import styles from "./Loader.module.css";

export default function Loader() {
  return (
    <div className={styles.container} role="status" aria-label="Loading">
      <div className={styles.spinner} />
      <p className={styles.text}>Loading data…</p>
    </div>
  );
}
