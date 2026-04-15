-- CreateTable
CREATE TABLE "product_mapping_de" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "part_number" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_mapping_de_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductSyncJob_DE" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "processed" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "finishedAt" TIMESTAMP(3),
    "cursorSku" TEXT,

    CONSTRAINT "ProductSyncJob_DE_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_mapping_de_shop_idx" ON "product_mapping_de"("shop");

-- CreateIndex
CREATE INDEX "product_mapping_de_sku_idx" ON "product_mapping_de"("sku");

-- CreateIndex
CREATE INDEX "ProductSyncJob_DE_shop_idx" ON "ProductSyncJob_DE"("shop");

-- CreateIndex
CREATE INDEX "ProductSyncJob_DE_status_idx" ON "ProductSyncJob_DE"("status");

-- CreateIndex
CREATE INDEX "ProductSyncJob_DE_createdAt_idx" ON "ProductSyncJob_DE"("createdAt");
