import { useState, useEffect } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { getEmployees } from "../../api/employees";
import { getPayrolls } from "../../api/payrolls";
import { formatCurrency } from "../../utils/formatters";
import styles from "./DashboardPage.module.css";

export default function DashboardPage() {
  const [employees, setEmployees] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, payRes] = await Promise.all([
          getEmployees(),
          getPayrolls(),
        ]);
        setEmployees(empRes.data);
        setPayrolls(payRes.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load dashboard data.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Derived stats from employee list
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(
    (e) => e.employment_status === "Active",
  ).length;
  const onLeaveEmployees = employees.filter(
    (e) => e.employment_status === "On Leave",
  ).length;

  // Total monthly payroll — sum of all net_salary in payrolls
  const totalPayroll = payrolls.reduce(
    (sum, p) => sum + parseFloat(p.net_salary ?? 0),
    0,
  );

  const CARDS = [
    {
      label: "Total Employees",
      value: loading ? "—" : totalEmployees,
      accent: "blue",
    },
    {
      label: "Active Employees",
      value: loading ? "—" : activeEmployees,
      accent: "green",
    },
    {
      label: "Employees on Leave",
      value: loading ? "—" : onLeaveEmployees,
      accent: "yellow",
    },
    {
      label: "Total Monthly Payroll",
      value: loading ? "—" : formatCurrency(totalPayroll),
      accent: "blue",
    },
  ];

  return (
    <MainLayout title="Dashboard">
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.grid}>
        {CARDS.map(({ label, value, accent }) => (
          <div
            key={label}
            className={`${styles.card} ${styles[`accent--${accent}`]}`}
          >
            <p className={styles.cardLabel}>{label}</p>
            <p className={styles.cardValue}>{value}</p>
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Recent Employees</h3>
        {loading ? (
          <p className={styles.empty}>Loading...</p>
        ) : employees.length === 0 ? (
          <p className={styles.empty}>No employees found.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Full Name</th>
                <th>Position</th>
                <th>Department</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.slice(0, 5).map((emp) => (
                <tr key={emp.id}>
                  <td>EMP-{String(emp.id).padStart(4, "0")}</td>
                  <td>{emp.full_name}</td>
                  <td>{emp.position}</td>
                  <td>{emp.department}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${styles[`badge--${emp.employment_status.toLowerCase().replace(" ", "-")}`]}`}
                    >
                      {emp.employment_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </MainLayout>
  );
}
