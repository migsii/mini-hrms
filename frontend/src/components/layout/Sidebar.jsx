import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import styles from "./Sidebar.module.css";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard" },
  { to: "/employees", label: "Employees" },
  { to: "/salary", label: "Salary" },
  { to: "/attendance", label: "Attendance" },
  { to: "/payroll", label: "Payroll" },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.logo}>HR</div>
        <span className={styles.brandName}>SmartRetail</span>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <button className={styles.logout} onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
}
