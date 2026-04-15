/*
  Warnings:

  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Session";

-- CreateTable
CREATE TABLE "shopify_products_final_Germany" (
    "id" BIGINT NOT NULL,
    "title" TEXT,
    "body_html" TEXT,
    "handle" TEXT,
    "vendor" TEXT,
    "product_type" TEXT,
    "tags" TEXT,
    "images" JSONB,
    "sku" TEXT,
    "inventory_management" TEXT,
    "inventory_quantity" BIGINT,
    "price" DOUBLE PRECISION,
    "compare_at_price" DOUBLE PRECISION,
    "barcode" TEXT,
    "specs_table" TEXT,
    "information" TEXT,
    "created_at" TIMESTAMPTZ(6),
    "part_number" BIGINT,
    "source_type" TEXT,
    "seo_title" TEXT,
    "seo_description" TEXT,
    "embedding" TEXT,

    CONSTRAINT "shopify_products_final_Germany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session_DE" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" TIMESTAMP(6),
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "accountOwner" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT,
    "collaborator" BOOLEAN DEFAULT false,
    "emailVerified" BOOLEAN DEFAULT false,
    "refreshToken" TEXT,
    "refreshTokenExpires" TIMESTAMP(6),

    CONSTRAINT "Session_DE_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_DE_shop_key" ON "Session_DE"("shop");
