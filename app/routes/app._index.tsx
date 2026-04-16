import type {
  HeadersFunction,
  LoaderFunctionArgs,
  ActionFunctionArgs,
} from "react-router";
import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { ConnectionPanel } from "../components/admin/ConnectionPanel";
import { DataTables } from "../components/admin/DataTables";
import { LogsPanel } from "../components/admin/LogsPanel";
import { RequestLogsPanel } from "../components/admin/RequestLogsPanel";
import { APISettingsPanel } from "../components/admin/APISettings";
import { GERMAN_COLORS } from "../components/admin/types";
import {
  getProductMappings,
  getProductSyncJob,
  getGermanyProducts,
  getSyncLogs,
  createProductMapping,
  deleteProductMapping,
  createProductSyncJob,
  updateProductSyncJob,
  createSyncLog,
} from "../lib/db.server";

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
  const shop = responseJson.data?.shop?.url || "";

  const mappings = await getProductMappings(shop);
  const syncJob = await getProductSyncJob(shop);
  const products = await getGermanyProducts(shop, 100);
  const syncLogs = await getSyncLogs(shop, 50);

  return {
    shop,
    products,
    mappings,
    syncJob,
    syncLogs,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
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
  const shop = responseJson.data?.shop?.url || "";

  const formData = await request.formData();
  const actionType = formData.get("action");

  if (actionType === "syncProducts") {
    const products = await getGermanyProducts(shop, 10000);
    
    const job = await createProductSyncJob({
      id: `job_${Date.now()}`,
      shop,
      total: products.length,
    });

    let processed = 0;
    let errors = 0;

    for (const product of products) {
      try {
        if (product.sku && product.price) {
          await createProductMapping({
            shop,
            sku: product.sku,
            price: product.price,
            part_number: product.part_number?.toString() || product.sku,
          });

          await createSyncLog({
            shop,
            jobId: job.id,
            action: "CREATE",
            sourceSku: product.sku,
            targetSku: product.sku,
            status: "SUCCESS",
            message: `Mapped product ${product.sku}`,
          });
          processed++;
        }
      } catch (error: unknown) {
        errors++;
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        await createSyncLog({
          shop,
          jobId: job.id,
          action: "CREATE",
          sourceSku: product.sku || undefined,
          targetSku: product.sku || undefined,
          status: "FAILED",
          message: errorMessage,
        });
      }

      await updateProductSyncJob(job.id, { processed });
    }

    await updateProductSyncJob(job.id, {
      status: errors > 0 ? "completed_with_errors" : "completed",
      processed,
      finishedAt: new Date(),
    });

    return { success: true, jobId: job.id, processed, errors };
  }

  if (actionType === "addMapping") {
    const sku = formData.get("sku") as string;
    const part_number = formData.get("part_number") as string;
    const price = parseFloat(formData.get("price") as string) || 0;

    await createProductMapping({
      shop,
      sku,
      price,
      part_number,
    });
    return { success: true, message: "Mapping added" };
  }

  if (actionType === "deleteMapping") {
    const id = formData.get("id") as string;
    await deleteProductMapping(id);
    return { success: true, message: "Mapping deleted" };
  }

  return { success: false, message: "Unknown action" };
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

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
          <ConnectionPanel shop={data.shop} />
          
          <DataTables
            products={data.products}
            mappings={data.mappings}
            syncJob={data.syncJob}
            syncLogs={data.syncLogs}
          />
          
          <APISettingsPanel shop={data.shop} />
          
          <LogsPanel />
          
          <RequestLogsPanel />
        </div>
      </div>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
