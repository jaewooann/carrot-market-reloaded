/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `SMSToken` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "SMSToken" ADD COLUMN "phone" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "SMSToken_phone_key" ON "SMSToken"("phone");
