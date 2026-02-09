-- AlterTable
ALTER TABLE "Reel" ADD COLUMN     "caption" TEXT,
ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "homepageEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "instagramPermalink" TEXT;

-- CreateIndex
CREATE INDEX "Reel_homepageEnabled_idx" ON "Reel"("homepageEnabled");

-- CreateIndex
CREATE INDEX "Reel_displayOrder_idx" ON "Reel"("displayOrder");
