import { useState, useEffect } from "react";
import MainLayout from "../../components/layout/MainLayout";
import DataTable from "../../components/ui/DataTable/DataTable";
import Badge from "../../components/ui/Badge/Badge";
import { getEmployees } from "../../api/employees";
import { getPayrolls } from "../../api/payrolls";
import { formatCurrency } from "../../utils/formatters";
import styles from "./DashboardPage.module.css";

const COLUMNS = [
  {
    key: "id",
    label: "Employee ID",
    render: (row) => `EMP-${String(row.id).padStart(4, "0")}`,
  },
  { key: "full_name", label: "Full Name" },
  { key: "position", label: "Position" },
  { key: "department", label: "Department" },
  {
    key: "employment_status",
    label: "Status",
    render: (row) => <Badge status={row.employment_status} />,
  },
];

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
      } catch {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(
    (e) => e.employment_status === "Active",
  ).length;
  const onLeaveEmployees = employees.filter(
    (e) => e.employment_status === "On Leave",
  ).length;
  const totalPayroll = payrolls.reduce(
    (sum, p) => sum + parseFloat(p.net_salary ?? 0),
    0,
  );

  const CARDS = [
    { label: "Total Employees", value: totalEmployees, accent: "blue" },
    { label: "Active Employees", value: activeEmployees, accent: "green" },
    { label: "Employees on Leave", value: onLeaveEmployees, accent: "yellow" },
    {
      label: "Total Monthly Payroll",
      value: formatCurrency(totalPayroll),
      accent: "blue",
    },
  ];

  const renderEmployeeCard = (emp) => (
    <>
      <div className={styles.cardHeader}>
        <div>
          <p className={styles.cardName}>{emp.full_name}</p>
          <p className={styles.cardSub}>
            EMP-{String(emp.id).padStart(4, "0")} · {emp.position}
          </p>
        </div>
        <Badge status={emp.employment_status} />
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Department</span>
          <span>{emp.department}</span>
        </div>
      </div>
    </>
  );

  return (
    <MainLayout title="Dashboard">
      {error && <div className={styles.error}>{error}</div>}

      {/* Stat Cards */}
      <div className={styles.grid}>
        {CARDS.map(({ label, value, accent }) => (
          <div
            key={label}
            className={`${styles.statCard} ${styles[`accent--${accent}`]}`}
          >
            <p className={styles.statLabel}>{label}</p>
            <p className={styles.statValue}>{loading ? "—" : value}</p>
          </div>
        ))}
      </div>

      {/* Recent Employees */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Recent Employees</h3>
        <DataTable
          columns={COLUMNS}
          data={employees.slice(0, 5)}
          loading={loading}
          emptyMessage="No employees found."
          renderCard={renderEmployeeCard}
        />
      </div>
    </MainLayout>
  );
}
