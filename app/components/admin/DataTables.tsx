import { useState } from "react";
import { useFetcher } from "react-router";
import { GERMAN_COLORS } from "./types";
import type { ProductMapping_DE, ProductSyncJob_DE, shopify_products_final_Germany, SyncLog_DE } from "./types";

interface DataTablesProps {
  products?: shopify_products_final_Germany[];
  mappings?: ProductMapping_DE[];
  syncJob?: ProductSyncJob_DE | null;
  syncLogs?: SyncLog_DE[];
}

export function DataTables({ 
  products: initialProducts = [], 
  mappings: initialMappings = [], 
  syncJob: initialSyncJob,
  syncLogs: initialSyncLogs = [],
}: DataTablesProps) {
  const fetcher = useFetcher();
  
  const products = initialProducts;
  const mappings = initialMappings;
  const syncJob = initialSyncJob;
  const syncLogs = initialSyncLogs;

  const [activeTab, setActiveTab] = useState<"products" | "mappings" | "logs">("products");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMapping, setNewMapping] = useState({ sku: "", part_number: "", price: "" });

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
    tabs: {
      display: "flex",
      gap: "4px",
      marginBottom: "20px",
      borderBottom: `2px solid ${GERMAN_COLORS.border}`,
    },
    tab: {
      padding: "12px 24px",
      cursor: "pointer",
      border: "none",
      backgroundColor: "transparent",
      fontWeight: 500,
      fontSize: "14px",
      color: GERMAN_COLORS.textSecondary,
      borderBottom: "2px solid transparent",
      marginBottom: "-2px",
    },
    activeTab: {
      color: GERMAN_COLORS.primary,
      borderBottomColor: GERMAN_COLORS.primary,
    },
    table: {
      width: "100%",
      borderCollapse: "collapse" as const,
      fontSize: "14px",
    },
    th: {
      textAlign: "left" as const,
      padding: "12px",
      backgroundColor: GERMAN_COLORS.background,
      color: GERMAN_COLORS.textPrimary,
      fontWeight: 600,
      borderBottom: `2px solid ${GERMAN_COLORS.border}`,
    },
    td: {
      padding: "12px",
      borderBottom: `1px solid ${GERMAN_COLORS.border}`,
      color: GERMAN_COLORS.textPrimary,
    },
    emptyState: {
      textAlign: "center" as const,
      padding: "40px",
      color: GERMAN_COLORS.textSecondary,
    },
    button: {
      padding: "8px 16px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontWeight: 500,
      fontSize: "13px",
      backgroundColor: GERMAN_COLORS.primary,
      color: "white",
    },
    smallButton: {
      padding: "6px 12px",
      fontSize: "12px",
    },
    progressBar: {
      height: "8px",
      backgroundColor: GERMAN_COLORS.border,
      borderRadius: "4px",
      overflow: "hidden",
      marginTop: "8px",
    },
    progressFill: {
      height: "100%",
      backgroundColor: GERMAN_COLORS.success,
      transition: "width 0.3s ease",
    },
    syncStatus: {
      padding: "12px",
      borderRadius: "6px",
      backgroundColor: GERMAN_COLORS.background,
      marginBottom: "16px",
    },
    formRow: {
      display: "flex",
      gap: "12px",
      marginBottom: "12px",
      alignItems: "flex-end",
    },
    input: {
      padding: "8px 12px",
      borderRadius: "6px",
      border: `1px solid ${GERMAN_COLORS.border}`,
      fontSize: "14px",
      flex: 1,
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
    statusFailed: {
      backgroundColor: `${GERMAN_COLORS.error}20`,
      color: GERMAN_COLORS.error,
    },
  };

  const progressPercentage = syncJob?.total 
    ? Math.round((syncJob.processed / syncJob.total) * 100)
    : 0;

  const handleAddMapping = () => {
    fetcher.submit(
      { 
        action: "addMapping", 
        sku: newMapping.sku, 
        part_number: newMapping.part_number, 
        price: newMapping.price 
      },
      { method: "post" }
    );
    setNewMapping({ sku: "", part_number: "", price: "" });
    setShowAddForm(false);
  };

  const isSyncing = fetcher.state !== "idle" && fetcher.formData?.get("action") === "syncProducts";

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Product Data</h2>

      {syncJob && (
        <div style={styles.syncStatus}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span><strong>Sync Status:</strong> {syncJob.status}</span>
            <span>{syncJob.processed} / {syncJob.total}</span>
          </div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${progressPercentage}%` }} />
          </div>
        </div>
      )}

      <fetcher.Form method="post">
        <button
          style={styles.button}
          name="action"
          value="syncProducts"
          disabled={isSyncing}
        >
          {isSyncing ? "Syncing..." : "Sync Products to Mappings"}
        </button>
      </fetcher.Form>

      <div style={styles.tabs}>
        <button
          style={{ ...styles.tab, ...(activeTab === "products" ? styles.activeTab : {}) }}
          onClick={() => setActiveTab("products")}
        >
          Product Catalog ({products.length})
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === "mappings" ? styles.activeTab : {}) }}
          onClick={() => setActiveTab("mappings")}
        >
          SKU Mappings ({mappings.length})
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === "logs" ? styles.activeTab : {}) }}
          onClick={() => setActiveTab("logs")}
        >
          Sync Logs ({syncLogs.length})
        </button>
      </div>

      {activeTab === "products" && (
        products.length === 0 ? (
          <div style={styles.emptyState}>No products found in source table</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>SKU</th>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Stock</th>
                <th style={styles.th}>Part Number</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id.toString()}>
                  <td style={styles.td}>{product.sku || "-"}</td>
                  <td style={styles.td}>{product.title || "-"}</td>
                  <td style={styles.td}>{product.price ? `€${product.price.toFixed(2)}` : "-"}</td>
                  <td style={styles.td}>{product.inventory_quantity?.toString() || "0"}</td>
                  <td style={styles.td}>{product.part_number?.toString() || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}

      {activeTab === "mappings" && (
        <>
          <button
            style={{ ...styles.button, marginBottom: "16px" }}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "Cancel" : "+ Add Mapping"}
          </button>

          {showAddForm && (
            <div style={styles.formRow}>
              <input
                style={styles.input}
                placeholder="Shop SKU"
                value={newMapping.sku}
                onChange={(e) => setNewMapping({ ...newMapping, sku: e.target.value })}
              />
              <input
                style={styles.input}
                placeholder="Ingram Part Number"
                value={newMapping.part_number}
                onChange={(e) => setNewMapping({ ...newMapping, part_number: e.target.value })}
              />
              <input
                style={styles.input}
                placeholder="Price"
                type="number"
                value={newMapping.price}
                onChange={(e) => setNewMapping({ ...newMapping, price: e.target.value })}
              />
              <button style={styles.button} onClick={handleAddMapping}>Add</button>
            </div>
          )}

          {mappings.length === 0 ? (
            <div style={styles.emptyState}>No mappings found. Click Sync Products to create mappings.</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Shop SKU</th>
                  <th style={styles.th}>Ingram Part Number</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mappings.map((mapping) => (
                  <tr key={mapping.id}>
                    <td style={styles.td}>{mapping.sku}</td>
                    <td style={styles.td}>{mapping.part_number}</td>
                    <td style={styles.td}>
                      {mapping.price !== null && mapping.price !== undefined 
                        ? `€${Number(mapping.price).toFixed(2)}` 
                        : "-"}
                    </td>
                    <td style={styles.td}>
                      <fetcher.Form method="post" style={{ display: "inline" }}>
                        <input type="hidden" name="action" value="deleteMapping" />
                        <input type="hidden" name="id" value={mapping.id} />
                        <button
                          style={{ ...styles.button, ...styles.smallButton, backgroundColor: GERMAN_COLORS.accent }}
                          type="submit"
                        >
                          Delete
                        </button>
                      </fetcher.Form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {activeTab === "logs" && (
        syncLogs.length === 0 ? (
          <div style={styles.emptyState}>No sync logs found</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Time</th>
                <th style={styles.th}>Job ID</th>
                <th style={styles.th}>Action</th>
                <th style={styles.th}>Source SKU</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Message</th>
              </tr>
            </thead>
            <tbody>
              {syncLogs.map((log) => (
                <tr key={log.id}>
                  <td style={styles.td}>{new Date(log.createdAt).toLocaleString()}</td>
                  <td style={styles.td}>{log.jobId}</td>
                  <td style={styles.td}>{log.action}</td>
                  <td style={styles.td}>{log.sourceSku || "-"}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        ...(log.status === "SUCCESS" ? styles.statusSuccess : styles.statusFailed),
                      }}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td style={styles.td}>{log.message || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
}

export function loader() {
  return null;
}
