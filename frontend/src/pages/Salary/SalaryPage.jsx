import { useState, useEffect } from "react";
import MainLayout from "../../components/layout/MainLayout";
import DataTable from "../../components/ui/DataTable/DataTable";
import { getEmployees } from "../../api/employees";
import { getSalary, createSalary, updateSalary } from "../../api/salaries";
import { formatCurrency } from "../../utils/formatters";
import styles from "./SalaryPage.module.css";

const EMPTY_FORM = {
  basic_salary: "",
  allowance: "",
  deductions: "",
};

export default function SalaryPage() {
  const [employees, setEmployees] = useState([]);
  const [salaryMap, setSalaryMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [activeEmployee, setActiveEmployee] = useState(null);
  const [hasSalary, setHasSalary] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empRes = await getEmployees();
        const emps = empRes.data;
        setEmployees(emps);

        const salaryResults = await Promise.allSettled(
          emps.map((emp) => getSalary(emp.id)),
        );

        const map = {};
        salaryResults.forEach((result, i) => {
          if (result.status === "fulfilled" && result.value.data) {
            map[emps[i].id] = result.value.data;
          }
        });
        setSalaryMap(map);
      } catch {
        setError("Failed to load salary data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refreshSalary = async (employeeId) => {
    try {
      const res = await getSalary(employeeId);
      setSalaryMap((prev) => ({ ...prev, [employeeId]: res.data }));
    } catch {
      setSalaryMap((prev) => ({ ...prev }));
    }
  };

  const openModal = (employee) => {
    const existing = salaryMap[employee.id];
    setActiveEmployee(employee);
    setHasSalary(!!existing);
    setForm({
      basic_salary: existing?.basic_salary ?? "",
      allowance: existing?.allowance ?? "",
      deductions: existing?.deductions ?? "",
    });
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setActiveEmployee(null);
    setForm(EMPTY_FORM);
    setFormError("");
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const computedNetSalary =
    (parseFloat(form.basic_salary) || 0) +
    (parseFloat(form.allowance) || 0) -
    (parseFloat(form.deductions) || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    const payload = {
      employee_id: activeEmployee.id,
      basic_salary: parseFloat(form.basic_salary),
      allowance: parseFloat(form.allowance) || 0,
      deductions: parseFloat(form.deductions) || 0,
    };

    try {
      if (hasSalary) {
        await updateSalary(activeEmployee.id, payload);
      } else {
        await createSalary(payload);
      }
      await refreshSalary(activeEmployee.id);
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const tableData = employees.map((emp) => ({
    ...emp,
    salary: salaryMap[emp.id] ?? null,
  }));

  const columns = [
    {
      key: "id",
      label: "Employee ID",
      render: (row) => `EMP-${String(row.id).padStart(4, "0")}`,
    },
    { key: "full_name", label: "Full Name" },
    {
      key: "basic_salary",
      label: "Basic Salary",
      render: (row) =>
        row.salary ? formatCurrency(row.salary.basic_salary) : "—",
    },
    {
      key: "allowance",
      label: "Allowance",
      render: (row) =>
        row.salary ? formatCurrency(row.salary.allowance) : "—",
    },
    {
      key: "deductions",
      label: "Deductions",
      render: (row) =>
        row.salary ? formatCurrency(row.salary.deductions) : "—",
    },
    {
      key: "net_salary",
      label: "Net Salary",
      render: (row) =>
        row.salary ? (
          <strong>{formatCurrency(row.salary.net_salary)}</strong>
        ) : (
          "—"
        ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <button className={styles.btnEdit} onClick={() => openModal(row)}>
          {row.salary ? "Edit" : "Set Salary"}
        </button>
      ),
    },
  ];

  const renderSalaryCard = (row) => (
    <>
      <div className={styles.cardHeader}>
        <div>
          <p className={styles.cardName}>{row.full_name}</p>
          <p className={styles.cardSub}>
            EMP-{String(row.id).padStart(4, "0")}
          </p>
        </div>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Basic Salary</span>
          <span>
            {row.salary ? formatCurrency(row.salary.basic_salary) : "—"}
          </span>
        </div>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Allowance</span>
          <span>{row.salary ? formatCurrency(row.salary.allowance) : "—"}</span>
        </div>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Deductions</span>
          <span>
            {row.salary ? formatCurrency(row.salary.deductions) : "—"}
          </span>
        </div>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Net Salary</span>
          <strong>
            {row.salary ? formatCurrency(row.salary.net_salary) : "—"}
          </strong>
        </div>
      </div>
      <div className={styles.cardFooter}>
        <button className={styles.btnEdit} onClick={() => openModal(row)}>
          {row.salary ? "Edit" : "Set Salary"}
        </button>
      </div>
    </>
  );

  return (
    <MainLayout title="Salary Management">
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.toolbar}>
        <h3 className={styles.count}>
          {loading
            ? "..."
            : `${employees.length} Employee${employees.length !== 1 ? "s" : ""}`}
        </h3>
      </div>

      <DataTable
        columns={columns}
        data={tableData}
        loading={loading}
        emptyMessage="No employees found. Add employees first."
        renderCard={renderSalaryCard}
      />

      {showModal && (
        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>
                {hasSalary ? "Edit Salary" : "Set Salary"} —{" "}
                {activeEmployee.full_name}
              </h3>
              <button className={styles.modalClose} onClick={closeModal}>
                ✕
              </button>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              {formError && <div className={styles.error}>{formError}</div>}

              <div className={styles.field}>
                <label>Basic Salary</label>
                <input
                  name="basic_salary"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.basic_salary}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label>Allowance</label>
                <input
                  name="allowance"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.allowance}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.field}>
                <label>Deductions</label>
                <input
                  name="deductions"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.deductions}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.netPreview}>
                <span>Net Salary</span>
                <strong>{formatCurrency(computedNetSalary)}</strong>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.btnPrimary}
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : "Save Salary"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
