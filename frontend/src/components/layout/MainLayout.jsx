import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import styles from "./MainLayout.module.css";

export default function MainLayout({ title, children }) {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.main}>
        <TopBar title={title} />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
