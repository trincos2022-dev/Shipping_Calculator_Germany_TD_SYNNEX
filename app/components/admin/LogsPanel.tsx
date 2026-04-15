import { useState } from "react";
import { GERMAN_COLORS } from "./types";
import type { ShippingCalculationLog_DE } from "./types";

interface LogsPanelProps {
  logs?: ShippingCalculationLog_DE[];
}

export function LogsPanel({ logs = [] }: LogsPanelProps) {
  const [filter, setFilter] = useState<"all" | "success" | "failed">("all");

  const styles = {
    container: {
      backgroundColor: GERMAN_COLORS.surface,
      borderRadius: "8px",
      padding: "24px",
      border: `1px solid ${GERMAN_COLORS.border}`,
      marginBottom: "20px",
    },
    header: {
      fontSize: "18px",
      fontWeight: 600,
      color: GERMAN_COLORS.textPrimary,
      marginBottom: "20px",
      borderBottom: `2px solid ${GERMAN_COLORS.primary}`,
      paddingBottom: "12px",
    },
    filterRow: {
      display: "flex",
      gap: "8px",
      marginBottom: "16px",
    },
    filterButton: {
      padding: "6px 12px",
      borderRadius: "4px",
      border: `1px solid ${GERMAN_COLORS.border}`,
      backgroundColor: GERMAN_COLORS.surface,
      cursor: "pointer",
      fontSize: "13px",
      color: GERMAN_COLORS.textSecondary,
    },
    activeFilter: {
      backgroundColor: GERMAN_COLORS.primary,
      color: "white",
      borderColor: GERMAN_COLORS.primary,
    },
    table: {
      width: "100%",
      borderCollapse: "collapse" as const,
      fontSize: "13px",
    },
    th: {
      textAlign: "left" as const,
      padding: "10px",
      backgroundColor: GERMAN_COLORS.background,
      color: GERMAN_COLORS.textPrimary,
      fontWeight: 600,
      borderBottom: `2px solid ${GERMAN_COLORS.border}`,
      fontSize: "12px",
    },
    td: {
      padding: "10px",
      borderBottom: `1px solid ${GERMAN_COLORS.border}`,
      color: GERMAN_COLORS.textPrimary,
    },
    statusBadge: {
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: 500,
    },
    statusDone: {
      backgroundColor: `${GERMAN_COLORS.success}20`,
      color: GERMAN_COLORS.success,
    },
    statusFailed: {
      backgroundColor: `${GERMAN_COLORS.error}20`,
      color: GERMAN_COLORS.error,
    },
    emptyState: {
      textAlign: "center" as const,
      padding: "40px",
      color: GERMAN_COLORS.textSecondary,
    },
    timestamp: {
      color: GERMAN_COLORS.textSecondary,
      fontSize: "12px",
    },
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  const filteredLogs = logs.filter((log) => {
    if (filter === "all") return true;
    if (filter === "success") return log.status === "Done";
    if (filter === "failed") return log.status === "Failed";
    return true;
  });

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Shipping Calculation Logs</h2>

      <div style={styles.filterRow}>
        <button
          style={{ ...styles.filterButton, ...(filter === "all" ? styles.activeFilter : {}) }}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          style={{ ...styles.filterButton, ...(filter === "success" ? styles.activeFilter : {}) }}
          onClick={() => setFilter("success")}
        >
          Success
        </button>
        <button
          style={{ ...styles.filterButton, ...(filter === "failed" ? styles.activeFilter : {}) }}
          onClick={() => setFilter("failed")}
        >
          Failed
        </button>
      </div>

      {filteredLogs.length === 0 ? (
        <div style={styles.emptyState}>No logs found</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Timestamp</th>
              <th style={styles.th}>SKU</th>
              <th style={styles.th}>Base Price</th>
              <th style={styles.th}>Tax</th>
              <th style={styles.th}>Carrier Charge</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id}>
                <td style={{ ...styles.td, ...styles.timestamp }}>
                  {formatDate(log.createdAt)}
                </td>
                <td style={styles.td}>{log.sku}</td>
                <td style={styles.td}>{log.basePrice.toFixed(2)} €</td>
                <td style={styles.td}>{log.taxAmount.toFixed(2)} €</td>
                <td style={styles.td}>{log.carrierCharge.toFixed(2)} €</td>
                <td style={styles.td}><strong>{log.total.toFixed(2)} €</strong></td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      ...(log.status === "Done" ? styles.statusDone : styles.statusFailed),
                    }}
                  >
                    {log.status === "Done" ? "Success" : "Failed"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
