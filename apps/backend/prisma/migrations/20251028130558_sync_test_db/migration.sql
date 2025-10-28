/*
  Warnings:

  - You are about to drop the column `eventType` on the `AuditEvent` table. All the data in the column will be lost.
  - Added the required column `type` to the `AuditEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AuditEvent" DROP COLUMN "eventType",
ADD COLUMN     "type" TEXT NOT NULL;
