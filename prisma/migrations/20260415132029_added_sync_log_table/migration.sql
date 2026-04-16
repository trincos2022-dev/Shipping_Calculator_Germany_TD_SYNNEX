-- CreateTable
CREATE TABLE "sync_log_de" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "sourceSku" TEXT,
    "targetSku" TEXT,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sync_log_de_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sync_log_de_shop_idx" ON "sync_log_de"("shop");

-- CreateIndex
CREATE INDEX "sync_log_de_jobId_idx" ON "sync_log_de"("jobId");

-- CreateIndex
CREATE INDEX "sync_log_de_createdAt_idx" ON "sync_log_de"("createdAt");
