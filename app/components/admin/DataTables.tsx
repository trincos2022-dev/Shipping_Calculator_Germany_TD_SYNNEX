import { useState } from "react";
import { useFetcher } from "react-router";
import { GERMAN_COLORS } from "./types";
import type { ProductMapping_DE, shopify_products_final_DE } from "./types";

interface ProductWithMapping extends shopify_products_final_DE {
  mapping?: ProductMapping_DE;
}

interface DataTablesProps {
  products?: ProductWithMapping[];
  mappings?: ProductMapping_DE[];
  syncStatus?: {
    status: string;
    processed: number;
    total: number;
  } | null;
}

export function DataTables({ products = [], mappings = [], syncStatus }: DataTablesProps) {
  const [activeTab, setActiveTab] = useState<"products" | "mappings">("products");
  const fetcher = useFetcher();

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
  };

  const progressPercentage = syncStatus?.total 
    ? Math.round((syncStatus.processed / syncStatus.total) * 100)
    : 0;

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Product Data</h2>

      {syncStatus && (
        <div style={styles.syncStatus}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span><strong>Sync Status:</strong> {syncStatus.status}</span>
            <span>{syncStatus.processed} / {syncStatus.total}</span>
          </div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${progressPercentage}%` }} />
          </div>
        </div>
      )}

      <button
        style={styles.button}
        onClick={() => fetcher.submit({ action: "syncProducts" }, { method: "post" })}
        disabled={fetcher.state !== "idle"}
      >
        Sync Products
      </button>

      <div style={styles.tabs}>
        <button
          style={{ ...styles.tab, ...(activeTab === "products" ? styles.activeTab : {}) }}
          onClick={() => setActiveTab("products")}
        >
          Product Catalog
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === "mappings" ? styles.activeTab : {}) }}
          onClick={() => setActiveTab("mappings")}
        >
          SKU Mappings
        </button>
      </div>

      {activeTab === "products" && (
        products.length === 0 ? (
          <div style={styles.emptyState}>No products found</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>SKU</th>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td style={styles.td}>{product.sku}</td>
                  <td style={styles.td}>{product.title}</td>
                  <td style={styles.td}>{product.price.toFixed(2)} €</td>
                  <td style={styles.td}>{product.inventoryQty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}

      {activeTab === "mappings" && (
        mappings.length === 0 ? (
          <div style={styles.emptyState}>No mappings found</div>
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
                  <td style={styles.td}>{mapping.ingramPartNumber}</td>
                  <td style={styles.td}>
                    {mapping.price !== null && mapping.price !== undefined 
                      ? `${mapping.price.toFixed(2)} €` 
                      : "-"}
                  </td>
                  <td style={styles.td}>
                    <button
                      style={{ ...styles.button, backgroundColor: GERMAN_COLORS.accent, padding: "6px 12px" }}
                      onClick={() => fetcher.submit(
                        { action: "deleteMapping", id: mapping.id },
                        { method: "post" }
                      )}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
}
