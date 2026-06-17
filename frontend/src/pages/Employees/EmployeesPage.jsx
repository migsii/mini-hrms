import { useState, useEffect } from "react";
import MainLayout from "../../components/layout/MainLayout";
import DataTable from "../../components/ui/DataTable/DataTable";
import Badge from "../../components/ui/Badge/Badge";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../api/employees";
import { formatDate } from "../../utils/formatters";
import styles from "./EmployeesPage.module.css";

const EMPTY_FORM = {
  full_name: "",
  email: "",
  contact_number: "",
  position: "",
  department: "",
  date_hired: "",
  employment_status: "Active",
};

const COLUMNS = [
  {
    key: "id",
    label: "Employee ID",
    render: (row) => `EMP-${String(row.id).padStart(4, "0")}`,
  },
  { key: "full_name", label: "Full Name" },
  { key: "email", label: "Email" },
  { key: "position", label: "Position" },
  { key: "department", label: "Department" },
  {
    key: "date_hired",
    label: "Date Hired",
    render: (row) => formatDate(row.date_hired),
  },
  {
    key: "employment_status",
    label: "Status",
    render: (row) => <Badge status={row.employment_status} />,
  },
];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ── Data Fetching ──
  const refreshEmployees = async () => {
    try {
      const res = await getEmployees();
      setEmployees(res.data);
    } catch {
      setError("Failed to load employees.");
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await getEmployees();
        setEmployees(res.data);
      } catch {
        setError("Failed to load employees.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // ── Modal Handlers ──
  const openAddModal = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (emp) => {
    setEditTarget(emp);
    setForm({
      full_name: emp.full_name,
      email: emp.email,
      contact_number: emp.contact_number,
      position: emp.position,
      department: emp.department,
      date_hired: emp.date_hired,
      employment_status: emp.employment_status,
    });
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setFormError("");
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);
    try {
      if (editTarget) {
        await updateEmployee(editTarget.id, form);
      } else {
        await createEmployee(form);
      }
      await refreshEmployees();
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete Handlers ──
  const handleDeleteConfirm = async () => {
    try {
      await deleteEmployee(deleteTarget.id);
      await refreshEmployees();
      setDeleteTarget(null);
    } catch {
      setError("Failed to delete employee.");
      setDeleteTarget(null);
    }
  };

  // ── Column Actions (needs access to handlers) ──
  const columns = [
    ...COLUMNS,
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className={styles.actions}>
          <button className={styles.btnEdit} onClick={() => openEditModal(row)}>
            Edit
          </button>
          <button
            className={styles.btnDelete}
            onClick={() => setDeleteTarget(row)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  // ── Mobile Card Render ──
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
          <span className={styles.cardLabel}>Email</span>
          <span>{emp.email}</span>
        </div>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Department</span>
          <span>{emp.department}</span>
        </div>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Date Hired</span>
          <span>{formatDate(emp.date_hired)}</span>
        </div>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Contact</span>
          <span>{emp.contact_number}</span>
        </div>
      </div>
      <div className={styles.cardFooter}>
        <button className={styles.btnEdit} onClick={() => openEditModal(emp)}>
          Edit
        </button>
        <button
          className={styles.btnDelete}
          onClick={() => setDeleteTarget(emp)}
        >
          Delete
        </button>
      </div>
    </>
  );

  return (
    <MainLayout title="Employees">
      {error && <div className={styles.error}>{error}</div>}

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <h3 className={styles.count}>
          {loading
            ? "..."
            : `${employees.length} Employee${employees.length !== 1 ? "s" : ""}`}
        </h3>
        <button className={styles.btnPrimary} onClick={openAddModal}>
          + Add Employee
        </button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={employees}
        loading={loading}
        emptyMessage="No employees found. Add one to get started."
        renderCard={renderEmployeeCard}
      />

      {/* Add / Edit Modal */}
      {showModal && (
        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{editTarget ? "Edit Employee" : "Add Employee"}</h3>
              <button className={styles.modalClose} onClick={closeModal}>
                ✕
              </button>
            </div>
            <form className={styles.form} onSubmit={handleSubmit}>
              {formError && <div className={styles.error}>{formError}</div>}
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label>Full Name</label>
                  <input
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label>Email</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label>Contact Number</label>
                  <input
                    name="contact_number"
                    value={form.contact_number}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label>Position</label>
                  <input
                    name="position"
                    value={form.position}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label>Department</label>
                  <input
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label>Date Hired</label>
                  <input
                    name="date_hired"
                    type="date"
                    value={form.date_hired}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label>Employment Status</label>
                  <select
                    name="employment_status"
                    value={form.employment_status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Resigned">Resigned</option>
                  </select>
                </div>
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
                  {submitting
                    ? "Saving..."
                    : editTarget
                      ? "Save Changes"
                      : "Add Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className={styles.overlay} onClick={() => setDeleteTarget(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Delete Employee</h3>
              <button
                className={styles.modalClose}
                onClick={() => setDeleteTarget(null)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>
                Are you sure you want to delete{" "}
                <strong>{deleteTarget.full_name}</strong>?
              </p>
              <p className={styles.deleteWarning}>
                This will also delete their salary and payroll records. This
                action cannot be undone.
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.btnSecondary}
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                className={styles.btnDelete}
                onClick={handleDeleteConfirm}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
