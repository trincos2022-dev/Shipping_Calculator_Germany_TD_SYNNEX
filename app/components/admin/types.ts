export interface ProductMapping_DE {
  id: string;
  shop: string;
  sku: string;
  price: number;
  part_number: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductSyncJob_DE {
  id: string;
  shop: string;
  status: "pending" | "running" | "completed" | "completed_with_errors" | "failed";
  processed: number;
  total: number;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
  finishedAt?: Date;
  cursorSku?: string;
}

export interface SyncLog_DE {
  id: string;
  shop: string;
  jobId: string;
  action: string;
  sourceSku?: string;
  targetSku?: string;
  status: string;
  message?: string;
  createdAt: Date;
}

export interface Settings_DE {
  id: string;
  shop: string;
  taxPercentage: number;
  carrierCharge: number;
  updatedAt: Date;
  usdToEurRate: number;
}

export interface ShippingCalculationLog_DE {
  id: string;
  shop: string;
  sku: string;
  basePrice: number;
  taxAmount: number;
  carrierCharge: number;
  total: number;
  status: string;
  error?: string;
  createdAt: Date;
}

export interface RequestLog_DE {
  id: string;
  shop: string;
  type: string;
  endpoint: string;
  method: string;
  requestBody?: string;
  responseBody?: string;
  status?: number;
  error?: string;
  durationMs?: number;
  createdAt: Date;
}

export interface CarrierConfiguration_DE {
  id: string;
  shopDomain: string;
  carrierCode: string;
  carrierName: string;
  carrierMode: string;
  displayName?: string;
  enabled: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FallbackRateSettings_DE {
  shopDomain: string;
  enabled: boolean;
  price: number;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IngramCredential_DE {
  shopDomain: string;
  clientId: string;
  clientSecret: string;
  customerNumber: string;
  countryCode: string;
  contactEmail?: string;
  senderId?: string;
  billToAddressId?: string;
  shipToAddressId?: string;
  sandbox: boolean;
  accessToken?: string;
  accessTokenExpiresAt?: Date;
  lastValidatedAt?: Date;
  lastValidationStatus?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface shopify_products_final_Germany {
  id: bigint;
  title?: string;
  body_html?: string;
  handle?: string;
  vendor?: string;
  product_type?: string;
  tags?: string;
  images?: unknown;
  sku?: string;
  inventory_management?: string;
  inventory_quantity?: bigint;
  price?: number;
  compare_at_price?: number;
  barcode?: string;
  specs_table?: string;
  information?: string;
  created_at?: Date;
  part_number?: bigint;
  source_type?: string;
  seo_title?: string;
  seo_description?: string;
  embedding?: string;
}

export const GERMAN_COLORS = {
  primary: "#1a365d",
  secondary: "#2c5282",
  accent: "#c53030",
  success: "#276749",
  warning: "#b7791f",
  error: "#c53030",
  background: "#f7fafc",
  surface: "#ffffff",
  textPrimary: "#1a202c",
  textSecondary: "#4a5568",
  border: "#e2e8f0",
} as const;

export const GERMAN_LABELS = {
  currency: "€",
  taxRate: "19%",
  dateFormat: "DD/MM/YYYY",
  countryCode: "DE",
  language: "de",
} as const;
