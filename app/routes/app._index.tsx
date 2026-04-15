import type {
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { ConnectionPanel } from "../components/admin/ConnectionPanel";
import { DataTables } from "../components/admin/DataTables";
import { LogsPanel } from "../components/admin/LogsPanel";
import { RequestLogsPanel } from "../components/admin/RequestLogsPanel";
import { APISettingsPanel } from "../components/admin/APISettings";
import { GERMAN_COLORS, type ProductMapping_DE, type shopify_products_final_DE, type ShippingCalculationLog_DE, type RequestLog_DE } from "../components/admin/types";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  
  const response = await admin.graphql(
    `#graphql
      query {
        shop {
          name
          url
        }
      }`
  );
  
  const responseJson = await response.json();
  const shop = responseJson.data?.shop?.url || "unknown";

  return {
    shop,
    products: [],
    mappings: [],
    syncStatus: null,
    logs: [],
    requestLogs: [],
  };
};

export default function Index() {
  const initialData = useLoaderData<typeof loader>();

  const styles = {
    page: {
      padding: "20px",
      backgroundColor: GERMAN_COLORS.background,
      minHeight: "100vh",
    },
    header: {
      marginBottom: "24px",
    },
    title: {
      fontSize: "28px",
      fontWeight: 700,
      color: GERMAN_COLORS.textPrimary,
      marginBottom: "8px",
    },
    subtitle: {
      fontSize: "14px",
      color: GERMAN_COLORS.textSecondary,
    },
    content: {
      maxWidth: "1200px",
    },
  };

  return (
    <s-page heading="Germany Tax & Shipping">
      <div style={styles.page}>
        <div style={styles.header}>
          <h1 style={styles.title}>Germany Tax & Shipping</h1>
          <p style={styles.subtitle}>
            Manage tax calculations and shipping for Germany
          </p>
        </div>

        <div style={styles.content}>
          <ConnectionPanel shop={initialData.shop} />
          
          <DataTables
            products={initialData.products as shopify_products_final_DE[]}
            mappings={initialData.mappings as ProductMapping_DE[]}
            syncStatus={initialData.syncStatus}
          />
          
          <APISettingsPanel shop={initialData.shop} />
          
          <LogsPanel
            logs={initialData.logs as ShippingCalculationLog_DE[]}
          />
          
          <RequestLogsPanel
            requestLogs={initialData.requestLogs as RequestLog_DE[]}
          />
        </div>
      </div>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
