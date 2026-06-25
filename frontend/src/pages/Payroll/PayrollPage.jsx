import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import DataTable from "../../components/ui/DataTable/DataTable";
import { getPayrolls } from "../../api/payrolls";
import styles from "./PayrollPage.module.css";

const COLUMNS = [
  {
    key: "id",
    label: "Payroll ID",
    render: (row) => `PAY-${String(row.id).padStart(4, "0")}`,
  },
  {
    key: "employee",
    label: "Employee",
    render: (row) => row.employee?.full_name || "-",
  },
  { key: "basic_salary", label: "Basic Salary" },
  { key: "allowance", label: "Allowance" },
  { key: "deductions", label: "Deductions" },
  { key: "net_salary", label: "Net Salary" },
  { key: "payroll_date", label: "Date" },
];

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPayrolls();
        setPayrolls(res.data);
      } catch {
        setError("Failed to load payrolls.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderCard = (row) => (
    <>
      <div className={styles.cardHeader}>
        <div>
          <p className={styles.cardName}>{row.employee?.full_name || "-"}</p>
          <p className={styles.cardSub}>
            PAY-{String(row.id).padStart(4, "0")} · {row.payroll_date}
          </p>
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Net Salary</span>
          <span>{row.net_salary}</span>
        </div>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Basic</span>
          <span>{row.basic_salary}</span>
        </div>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Allowance</span>
          <span>{row.allowance}</span>
        </div>
      </div>
    </>
  );

  return (
    <MainLayout title="Payroll">
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.toolbar}>
        <h3 className={styles.count}>
          {loading ? "..." : `${payrolls.length} Records`}
        </h3>
      </div>

      <DataTable
        columns={COLUMNS}
        data={payrolls}
        loading={loading}
        emptyMessage="No payroll records found."
        renderCard={renderCard}
      />
    </MainLayout>
  );
}
