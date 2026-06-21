CREATE TABLE "SizeGuide" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "htmlContent" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SizeGuide_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SizeGuide_name_key" ON "SizeGuide"("name");

ALTER TABLE "Product" ADD COLUMN "sizeGuideId" TEXT;

ALTER TABLE "Product" ADD CONSTRAINT "Product_sizeGuideId_fkey" FOREIGN KEY ("sizeGuideId") REFERENCES "SizeGuide"("id") ON DELETE SET NULL ON UPDATE CASCADE;
