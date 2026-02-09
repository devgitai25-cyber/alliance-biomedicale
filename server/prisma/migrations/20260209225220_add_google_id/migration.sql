/*
  Warnings:

  - You are about to drop the column `descriptionAr` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `descriptionEn` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `descriptionFr` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `nameAr` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `nameEn` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `nameFr` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the `ProductTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reel` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[googleId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductTranslation" DROP CONSTRAINT "ProductTranslation_productId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "descriptionAr",
DROP COLUMN "descriptionEn",
DROP COLUMN "descriptionFr",
DROP COLUMN "nameAr",
DROP COLUMN "nameEn",
DROP COLUMN "nameFr",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "ingredients" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "shortDescription" TEXT,
ADD COLUMN     "usage" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "googleId" TEXT;

-- DropTable
DROP TABLE "ProductTranslation";

-- DropTable
DROP TABLE "Reel";

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
