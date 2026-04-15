import { useState } from "react";
import { useFetcher } from "react-router";
import { GERMAN_COLORS } from "./types";

interface APISettingsPanelProps {
  shop: string;
}

export function APISettingsPanel({ shop }: APISettingsPanelProps) {
  const fetcher = useFetcher();
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [testing, setTesting] = useState(false);

  const styles = {
    container: {
      backgroundColor: GERMAN_COLORS.surface,
      borderRadius: "8px",
      padding: "24px",
      border: `1px solid ${GERMAN_COLORS.border}`,
    },
    header: {
      fontSize: "18px",
      fontWeight: 600,
      color: GERMAN_COLORS.textPrimary,
      marginBottom: "20px",
      borderBottom: `2px solid ${GERMAN_COLORS.primary}`,
      paddingBottom: "12px",
    },
    fieldGroup: {
      marginBottom: "16px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: 500,
      color: GERMAN_COLORS.textPrimary,
      marginBottom: "6px",
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: "6px",
      border: `1px solid ${GERMAN_COLORS.border}`,
      fontSize: "14px",
      color: GERMAN_COLORS.textPrimary,
      backgroundColor: GERMAN_COLORS.surface,
      outline: "none",
    },
    inputFocus: {
      borderColor: GERMAN_COLORS.primary,
      boxShadow: `0 0 0 3px ${GERMAN_COLORS.primary}20`,
    },
    hint: {
      fontSize: "12px",
      color: GERMAN_COLORS.textSecondary,
      marginTop: "4px",
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
    infoBox: {
      marginTop: "20px",
      padding: "16px",
      borderRadius: "6px",
      backgroundColor: GERMAN_COLORS.background,
      border: `1px solid ${GERMAN_COLORS.border}`,
    },
    infoTitle: {
      fontSize: "14px",
      fontWeight: 600,
      color: GERMAN_COLORS.textPrimary,
      marginBottom: "8px",
    },
    infoText: {
      fontSize: "13px",
      color: GERMAN_COLORS.textSecondary,
      lineHeight: 1.5,
    },
    webhookUrl: {
      fontFamily: "monospace",
      fontSize: "12px",
      backgroundColor: GERMAN_COLORS.surface,
      padding: "8px",
      borderRadius: "4px",
      wordBreak: "break-all" as const,
    },
  };

  const handleSave = () => {
    fetcher.submit(
      { action: "saveSettings", apiEndpoint, apiKey },
      { method: "post" }
    );
  };

  const handleTest = async () => {
    setTesting(true);
    fetcher.submit({ action: "testConnection" }, { method: "post" });
    setTimeout(() => setTesting(false), 2000);
  };

  const webhookUrl = `https://${shop}/api/checkout`;

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>API Settings</h2>

      <div style={styles.fieldGroup}>
        <label style={styles.label} htmlFor="api-endpoint">API Endpoint URL</label>
        <input
          id="api-endpoint"
          type="url"
          style={styles.input}
          placeholder="https://api.example.com"
          value={apiEndpoint}
          onChange={(e) => setApiEndpoint(e.target.value)}
        />
        <div style={styles.hint}>
          The base URL for the external API (e.g. https://api.example.com)
        </div>
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label} htmlFor="api-key">API Key</label>
        <input
          id="api-key"
          type="password"
          style={styles.input}
          placeholder="Your API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <div style={styles.hint}>
          Your API authentication key
        </div>
      </div>

      <div style={styles.fieldGroup}>
        <span style={styles.label}>Checkout Webhook URL</span>
        <div style={styles.webhookUrl}>{webhookUrl}</div>
        <div style={styles.hint}>
          This URL is called during the checkout process
        </div>
      </div>

      <div style={styles.buttonGroup}>
        <button
          style={{ ...styles.button, ...styles.primaryButton }}
          onClick={handleSave}
          disabled={fetcher.state !== "idle"}
        >
          Save Settings
        </button>
        <button
          style={{ ...styles.button, ...styles.secondaryButton }}
          onClick={handleTest}
          disabled={testing || fetcher.state !== "idle"}
        >
          {testing ? "Testing..." : "Test Connection"}
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

      <div style={styles.infoBox}>
        <div style={styles.infoTitle}>Note</div>
        <div style={styles.infoText}>
          The external API is called during checkout to:
          <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
            <li>Validate cart items</li>
            <li>Calculate tax (German VAT 19%)</li>
            <li>Calculate shipping costs</li>
            <li>Create order in external system</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
