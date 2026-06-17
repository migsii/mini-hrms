import { useAuth } from "../../hooks/useAuth";
import styles from "./TopBar.module.css";

export default function TopBar({ title, onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={onMenuClick}>
          ☰
        </button>
        <h2 className={styles.title}>{title}</h2>
      </div>
      <div className={styles.user}>
        <div className={styles.avatar}>{user?.name?.charAt(0) ?? "A"}</div>
        <span className={styles.name}>{user?.name ?? "Admin"}</span>
      </div>
    </header>
  );
}
