import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import DataTable from "../../components/ui/DataTable/DataTable";
import Badge from "../../components/ui/Badge/Badge";
import { getAttendance, createAttendance } from "../../api/attendance";
import { getEmployees } from "../../api/employees";
import styles from "./AttendancePage.module.css";

const EMPTY_FORM = {
  employee_id: "",
  date: "",
  time_in: "",
  time_out: "",
  status: "Present",
};

const COLUMNS = [
  {
    key: "id",
    label: "Attendance ID",
    render: (row) => `ATT-${String(row.id).padStart(4, "0")}`,
  },
  {
    key: "employee",
    label: "Employee",
    render: (row) => row.employee?.full_name || "-",
  },
  { key: "date", label: "Date" },
  { key: "time_in", label: "Time In" },
  { key: "time_out", label: "Time Out" },
  {
    key: "status",
    label: "Status",
    render: (row) => <Badge status={row.status} />,
  },
];

export default function AttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const res = await getAttendance();
      setAttendance(res.data);
    } catch {
      setError("Failed to load attendance.");
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const [attRes, empRes] = await Promise.all([
          getAttendance(),
          getEmployees(),
        ]);

        setAttendance(attRes.data);
        setEmployees(empRes.data);
        console.log(empRes.data);
      } catch {
        setError("Failed to load attendance.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const openModal = () => {
    setForm(EMPTY_FORM);
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(EMPTY_FORM);
    setFormError("");
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    try {
      await createAttendance(form);
      await fetchData();
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [...COLUMNS];

  const renderCard = (row) => (
    <>
      <div className={styles.cardHeader}>
        <div>
          <p className={styles.cardName}>{row.employee?.full_name || "-"}</p>
          <p className={styles.cardSub}>
            ATT-{String(row.id).padStart(4, "0")} · {row.date}
          </p>
        </div>
        <Badge status={row.status} />
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Time In</span>
          <span>{row.time_in}</span>
        </div>
        <div className={styles.cardRow}>
          <span className={styles.cardLabel}>Time Out</span>
          <span>{row.time_out}</span>
        </div>
      </div>
    </>
  );

  return (
    <MainLayout title="Attendance">
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.toolbar}>
        <h3 className={styles.count}>
          {loading ? "..." : `${attendance.length} Records`}
        </h3>

        <button className={styles.btnPrimary} onClick={openModal}>
          + Add Attendance
        </button>
      </div>

      <DataTable
        columns={columns}
        data={attendance}
        loading={loading}
        emptyMessage="No attendance records found."
        renderCard={renderCard}
      />

      {showModal && (
        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Add Attendance</h3>
              <button className={styles.modalClose} onClick={closeModal}>
                ✕
              </button>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              {formError && <div className={styles.error}>{formError}</div>}

              <div className={styles.field}>
                <label>Employee</label>
                <select
                  name="employee_id"
                  value={form.employee_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label>Time In</label>
                <input
                  type="time"
                  name="time_in"
                  value={form.time_in}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label>Time Out</label>
                <input
                  type="time"
                  name="time_out"
                  value={form.time_out}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label>Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Present">Present</option>
                  <option value="Late">Late</option>
                  <option value="Absent">Absent</option>
                </select>
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
                  {submitting ? "Saving..." : "Add Attendance"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
