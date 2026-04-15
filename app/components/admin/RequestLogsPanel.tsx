import { useState } from "react";
import { GERMAN_COLORS } from "./types";
import type { RequestLog_DE } from "./types";

interface RequestLogsPanelProps {
  requestLogs?: RequestLog_DE[];
}

export function RequestLogsPanel({ requestLogs = [] }: RequestLogsPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
    method: {
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "11px",
      fontWeight: 600,
      fontFamily: "monospace",
    },
    methodGet: {
      backgroundColor: `${GERMAN_COLORS.success}20`,
      color: GERMAN_COLORS.success,
    },
    methodPost: {
      backgroundColor: `${GERMAN_COLORS.primary}20`,
      color: GERMAN_COLORS.primary,
    },
    methodPut: {
      backgroundColor: `${GERMAN_COLORS.warning}20`,
      color: GERMAN_COLORS.warning,
    },
    methodDelete: {
      backgroundColor: `${GERMAN_COLORS.error}20`,
      color: GERMAN_COLORS.error,
    },
    statusBadge: {
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: 500,
    },
    statusSuccess: {
      backgroundColor: `${GERMAN_COLORS.success}20`,
      color: GERMAN_COLORS.success,
    },
    statusError: {
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
    duration: {
      fontFamily: "monospace",
      fontSize: "12px",
    },
    endpoint: {
      fontFamily: "monospace",
      fontSize: "12px",
      wordBreak: "break-all" as const,
    },
    expandableRow: {
      backgroundColor: GERMAN_COLORS.background,
    },
    expandedContent: {
      padding: "16px",
      backgroundColor: GERMAN_COLORS.background,
      borderBottom: `1px solid ${GERMAN_COLORS.border}`,
    },
    jsonBlock: {
      backgroundColor: GERMAN_COLORS.surface,
      padding: "12px",
      borderRadius: "4px",
      fontSize: "12px",
      fontFamily: "monospace",
      overflow: "auto",
      maxHeight: "200px",
      whiteSpace: "pre-wrap" as const,
      wordBreak: "break-word" as const,
    },
    expandButton: {
      padding: "4px 8px",
      borderRadius: "4px",
      border: `1px solid ${GERMAN_COLORS.border}`,
      backgroundColor: GERMAN_COLORS.surface,
      cursor: "pointer",
      fontSize: "12px",
      color: GERMAN_COLORS.textSecondary,
    },
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  const getMethodStyle = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET":
        return styles.methodGet;
      case "POST":
        return styles.methodPost;
      case "PUT":
        return styles.methodPut;
      case "DELETE":
        return styles.methodDelete;
      default:
        return {};
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>API Request Logs</h2>

      {requestLogs.length === 0 ? (
        <div style={styles.emptyState}>No requests found</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Timestamp</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Endpoint</th>
              <th style={styles.th}>Method</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Duration</th>
              <th style={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {requestLogs.map((log) => (
              <>
                <tr key={log.id}>
                  <td style={{ ...styles.td, ...styles.timestamp }}>
                    {formatDate(log.createdAt)}
                  </td>
                  <td style={styles.td}>{log.type}</td>
                  <td style={{ ...styles.td, ...styles.endpoint }}>
                    {log.endpoint}
                  </td>
                  <td style={styles.td}>
                    <span style={{ ...styles.method, ...getMethodStyle(log.method) }}>
                      {log.method}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {log.status && (
                      <span
                        style={{
                          ...styles.statusBadge,
                          ...(log.status < 400 ? styles.statusSuccess : styles.statusError),
                        }}
                      >
                        {log.status}
                      </span>
                    )}
                  </td>
                  <td style={{ ...styles.td, ...styles.duration }}>
                    {log.durationMs ? `${log.durationMs}ms` : "-"}
                  </td>
                  <td style={styles.td}>
                    <button
                      style={styles.expandButton}
                      onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                    >
                      {expandedId === log.id ? "Close" : "Details"}
                    </button>
                  </td>
                </tr>
                {expandedId === log.id && (
                  <tr>
                    <td colSpan={7} style={styles.expandedContent}>
                      {log.requestBody && (
                        <div style={{ marginBottom: "12px" }}>
                          <strong>Request:</strong>
                          <div style={styles.jsonBlock}>{log.requestBody}</div>
                        </div>
                      )}
                      {log.responseBody && (
                        <div style={{ marginBottom: "12px" }}>
                          <strong>Response:</strong>
                          <div style={styles.jsonBlock}>{log.responseBody}</div>
                        </div>
                      )}
                      {log.error && (
                        <div>
                          <strong style={{ color: GERMAN_COLORS.error }}>Error:</strong>
                          <div style={{ ...styles.jsonBlock, color: GERMAN_COLORS.error }}>
                            {log.error}
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
