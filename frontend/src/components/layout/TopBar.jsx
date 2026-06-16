import { useAuth } from "../../hooks/useAuth";
import styles from "./TopBar.module.css";

export default function TopBar({ title }) {
  const { user } = useAuth();

  return (
    <header className={styles.topbar}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.user}>
        <div className={styles.avatar}>{user?.name?.charAt(0) ?? "A"}</div>
        <span className={styles.name}>{user?.name ?? "Admin"}</span>
      </div>
    </header>
  );
}
