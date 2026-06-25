import { useState, useEffect } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { getEmployees } from "../../api/employees";
import { getPayrolls } from "../../api/payrolls";
import { formatCurrency } from "../../utils/formatters";
import styles from "./DashboardPage.module.css";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

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

  const activeEmployeeIds = new Set(
    employees
      .filter((e) => e.employment_status !== "Resigned")
      .map((e) => e.id),
  );

  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (e) => e.employment_status === "Active",
  ).length;

  const onLeaveEmployees = employees.filter(
    (e) => e.employment_status === "On Leave",
  ).length;

  const resignedEmployees = employees.filter(
    (e) => e.employment_status === "Resigned",
  ).length;

  const totalPayroll = payrolls
    .filter((p) => activeEmployeeIds.has(p.employee_id))
    .reduce((sum, p) => sum + Number(p.net_salary || 0), 0);

  const statusData = [
    {
      status: "Active",
      employees: activeEmployees,
    },
    {
      status: "On Leave",
      employees: onLeaveEmployees,
    },
    {
      status: "Resigned",
      employees: resignedEmployees,
    },
  ];

  const departmentMap = {};

  employees.forEach((emp) => {
    if (emp.employment_status === "Resigned") return;

    departmentMap[emp.department] = (departmentMap[emp.department] || 0) + 1;
  });

  const departmentData = Object.entries(departmentMap).map(
    ([department, employees]) => ({
      department,
      employees,
    }),
  );

  const cards = [
    {
      label: "Total Employees",
      value: totalEmployees,
    },
    {
      label: "Active Employees",
      value: activeEmployees,
    },
    {
      label: "Employees on Leave",
      value: onLeaveEmployees,
    },
    {
      label: "Monthly Payroll",
      value: formatCurrency(totalPayroll),
    },
  ];

  const STATUS_COLORS = {
    Active: "#22c55e",
    "On Leave": "#f59e0b",
    Resigned: "#ef4444",
  };

  const DEPARTMENT_COLORS = [
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#06b6d4",
    "#6366f1",
  ];

  return (
    <MainLayout title="Dashboard">
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.grid}>
        {cards.map(({ label, value, accent }) => (
          <div
            key={label}
            className={`${styles.statCard} ${styles[`accent--${accent}`]}`}
          >
            <p className={styles.statLabel}>{label}</p>
            <h2 className={styles.statValue}>{loading ? "—" : value}</h2>
          </div>
        ))}
      </div>

      <div className={styles.chartGrid}>
        <div className={styles.panel}>
          <h3>Employment Status</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis allowDecimals={false} />
              <Tooltip />

              <Bar dataKey="employees" radius={[8, 8, 0, 0]}>
                {statusData.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.panel}>
          <h3>Department Distribution</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis dataKey="department" type="category" width={100} />
              <Tooltip />

              <Bar dataKey="employees" radius={[0, 8, 8, 0]}>
                {departmentData.map((entry, index) => (
                  <Cell
                    key={entry.department}
                    fill={DEPARTMENT_COLORS[index % DEPARTMENT_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </MainLayout>
  );
}
