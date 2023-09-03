/*
  Warnings:

  - You are about to drop the `licenses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "licenses" DROP CONSTRAINT "licenses_userId_fkey";

-- DropTable
DROP TABLE "licenses";
