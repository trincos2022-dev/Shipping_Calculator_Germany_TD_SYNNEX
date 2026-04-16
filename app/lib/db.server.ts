import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

if (process.env.NODE_ENV !== "production") {
  if (globalThis.prismaGlobal === undefined) {
    globalThis.prismaGlobal = new PrismaClient();
  }
}

const prisma = globalThis.prismaGlobal ?? new PrismaClient();

export default prisma;

export async function getProductMappings(shop: string) {
  return prisma.productMapping_DE.findMany({
    where: { shop },
    orderBy: { createdAt: "desc" },
  });
}

export async function createProductMapping(data: {
  shop: string;
  sku: string;
  price: number;
  part_number: string;
}) {
  return prisma.productMapping_DE.create({ data });
}

export async function deleteProductMapping(id: string) {
  return prisma.productMapping_DE.delete({ where: { id } });
}

export async function getProductSyncJob(shop: string) {
  return prisma.productSyncJob_DE.findFirst({
    where: { shop },
    orderBy: { createdAt: "desc" },
  });
}

export async function createProductSyncJob(data: {
  id: string;
  shop: string;
  total: number;
}) {
  return prisma.productSyncJob_DE.create({
    data: {
      ...data,
      status: "pending",
    },
  });
}

export async function updateProductSyncJob(
  id: string,
  data: {
    status?: string;
    processed?: number;
    error?: string;
    cursorSku?: string;
    finishedAt?: Date;
  }
) {
  return prisma.productSyncJob_DE.update({
    where: { id },
    data,
  });
}

export async function createSyncLog(data: {
  shop: string;
  jobId: string;
  action: string;
  sourceSku?: string;
  targetSku?: string;
  status: string;
  message?: string;
}) {
  return prisma.syncLog_DE.create({ data });
}

export async function getSyncLogs(shop: string, limit = 100) {
  return prisma.syncLog_DE.findMany({
    where: { shop },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getGermanyProducts(shop: string, limit = 100, cursor?: bigint) {
  return prisma.shopify_products_final_Germany.findMany({
    take: limit,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { id: "asc" },
  });
}

export async function getSettings(shop: string) {
  const { Settings_DE } = prisma;
  return Settings_DE.findUnique({
    where: { shop },
  });
}

export async function upsertSettings(data: {
  shop: string;
  taxPercentage: number;
  carrierCharge: number;
  usdToEurRate?: number;
}) {
  const { Settings_DE } = prisma;
  return Settings_DE.upsert({
    where: { shop: data.shop },
    update: data,
    create: data,
  });
}
