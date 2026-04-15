import { useState } from "react";
import { useFetcher } from "react-router";
import { GERMAN_COLORS } from "./types";

interface ConnectionPanelProps {
  shop: string;
}

export function ConnectionPanel({ shop }: ConnectionPanelProps) {
  const fetcher = useFetcher();
  const [testing, setTesting] = useState(false);
  const [carrierServiceRegistered, setCarrierServiceRegistered] = useState(false);
  const [callbackUrlConfigured] = useState(true);

  const handleRegister = () => {
    setCarrierServiceRegistered(true);
    fetcher.submit({ action: "registerCarrier" }, { method: "post" });
  };

  const handleDeregister = () => {
    setCarrierServiceRegistered(false);
    fetcher.submit({ action: "deregisterCarrier" }, { method: "post" });
  };

  const handleTest = () => {
    setTesting(true);
    fetcher.submit({ action: "testCallback" }, { method: "post" });
    setTimeout(() => setTesting(false), 2000);
  };

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
    statusRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 0",
      borderBottom: `1px solid ${GERMAN_COLORS.border}`,
    },
    statusLabel: {
      color: GERMAN_COLORS.textSecondary,
      fontSize: "14px",
    },
    statusValue: {
      fontWeight: 500,
      color: GERMAN_COLORS.textPrimary,
    },
    statusActive: {
      color: GERMAN_COLORS.success,
    },
    statusInactive: {
      color: GERMAN_COLORS.error,
    },
    buttonGroup: {
      display: "flex",
      gap: "12px",
      marginTop: "20px",
    },
    button: {
      padding: "10px 20px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontWeight: 500,
      fontSize: "14px",
      transition: "all 0.2s",
    },
    primaryButton: {
      backgroundColor: GERMAN_COLORS.primary,
      color: "white",
    },
    secondaryButton: {
      backgroundColor: GERMAN_COLORS.secondary,
      color: "white",
    },
    accentButton: {
      backgroundColor: GERMAN_COLORS.accent,
      color: "white",
    },
    successMessage: {
      marginTop: "16px",
      padding: "12px",
      borderRadius: "6px",
      backgroundColor: `${GERMAN_COLORS.success}15`,
      color: GERMAN_COLORS.success,
      fontSize: "14px",
    },
    errorMessage: {
      marginTop: "16px",
      padding: "12px",
      borderRadius: "6px",
      backgroundColor: `${GERMAN_COLORS.error}15`,
      color: GERMAN_COLORS.error,
      fontSize: "14px",
    },
    shopInfo: {
      marginTop: "20px",
      padding: "12px",
      borderRadius: "6px",
      backgroundColor: GERMAN_COLORS.background,
      fontSize: "13px",
      color: GERMAN_COLORS.textSecondary,
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Connection Settings</h2>
      
      <div style={styles.statusRow}>
        <span style={styles.statusLabel}>Carrier Service</span>
        <span
          style={{
            ...styles.statusValue,
            ...(carrierServiceRegistered ? styles.statusActive : styles.statusInactive),
          }}
        >
          {carrierServiceRegistered ? "Active" : "Not registered"}
        </span>
      </div>
      
      <div style={styles.statusRow}>
        <span style={styles.statusLabel}>Callback URL</span>
        <span
          style={{
            ...styles.statusValue,
            ...(callbackUrlConfigured ? styles.statusActive : styles.statusInactive),
          }}
        >
          {callbackUrlConfigured ? "Configured" : "Not configured"}
        </span>
      </div>

      <div style={styles.buttonGroup}>
        <button
          style={{ ...styles.button, ...styles.primaryButton }}
          onClick={handleRegister}
          disabled={fetcher.state !== "idle"}
        >
          Register Carrier Service
        </button>
        <button
          style={{ ...styles.button, ...styles.secondaryButton }}
          onClick={handleDeregister}
          disabled={fetcher.state !== "idle"}
        >
          Deregister
        </button>
        <button
          style={{ ...styles.button, ...styles.accentButton }}
          onClick={handleTest}
          disabled={testing || fetcher.state !== "idle"}
        >
          {testing ? "Testing..." : "Test Callback"}
        </button>
      </div>

      {fetcher.data?.message && (
        <div
          style={
            fetcher.data.success
              ? styles.successMessage
              : styles.errorMessage
          }
        >
          {fetcher.data.message}
        </div>
      )}

      <div style={styles.shopInfo}>
        <strong>Shop:</strong> {shop}
      </div>
    </div>
  );
}
