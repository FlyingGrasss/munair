-- CreateEnum
CREATE TYPE "AdminEmailStatus" AS ENUM ('PROCESSING', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "SheetSyncStatus" AS ENUM ('PENDING', 'SYNCED', 'NOT_FOUND', 'UNCONFIGURED', 'FAILED');

-- CreateTable
CREATE TABLE "AdminEmail" (
    "id" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" "AdminEmailStatus" NOT NULL DEFAULT 'PROCESSING',
    "sheetSyncStatus" "SheetSyncStatus" NOT NULL DEFAULT 'PENDING',
    "providerMessageId" TEXT,
    "sheetMatches" JSONB,
    "lastErrorCode" TEXT,
    "applicationSubmissionId" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminEmail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminEmail_idempotencyKey_key" ON "AdminEmail"("idempotencyKey");

-- CreateIndex
CREATE INDEX "AdminEmail_recipientEmail_idx" ON "AdminEmail"("recipientEmail");

-- CreateIndex
CREATE INDEX "AdminEmail_applicationSubmissionId_idx" ON "AdminEmail"("applicationSubmissionId");

-- CreateIndex
CREATE INDEX "AdminEmail_createdAt_idx" ON "AdminEmail"("createdAt");

-- AddForeignKey
ALTER TABLE "AdminEmail" ADD CONSTRAINT "AdminEmail_applicationSubmissionId_fkey" FOREIGN KEY ("applicationSubmissionId") REFERENCES "ApplicationSubmission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
