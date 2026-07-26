import { AlertIcon } from "@/components/Icons";
import styles from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className={styles.container} role="alert">
      <span className={styles.icon} aria-hidden="true">
        <AlertIcon size={32} />
      </span>
      <h2 className={styles.title}>Something went wrong</h2>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button className={styles.retry} onClick={onRetry} type="button">
          Try Again
        </button>
      )}
    </div>
  );
}
