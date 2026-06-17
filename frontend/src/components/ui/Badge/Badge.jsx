import styles from "./Badge.module.css";

const STATUS_MAP = {
  Active: "active",
  "On Leave": "on-leave",
  Resigned: "resigned",
  Present: "present",
  Late: "late",
  Absent: "absent",
};

export default function Badge({ status }) {
  const key = STATUS_MAP[status] ?? "default";
  return (
    <span className={`${styles.badge} ${styles[`badge--${key}`]}`}>
      {status}
    </span>
  );
}
