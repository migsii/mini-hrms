import styles from "./DataTable.module.css";

export default function DataTable({
  columns,
  data,
  loading,
  emptyMessage = "No records found.",
  renderCard,
}) {
  if (loading) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.empty}>Loading...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.empty}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id ?? i}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.cardList}>
        {data.map((row, i) => (
          <div key={row.id ?? i} className={styles.card}>
            {renderCard(row)}
          </div>
        ))}
      </div>
    </div>
  );
}
