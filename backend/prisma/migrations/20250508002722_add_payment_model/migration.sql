-- CreateEnum
CREATE TYPE "PaymentStatusType" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED');

-- AlterEnum
ALTER TYPE "OrderStatusType" ADD VALUE 'PAID';

-- CreateTable
CREATE TABLE "Payment" (
    "id" BIGSERIAL NOT NULL,
    "orderId" BIGINT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "paymentMethod" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "status" "PaymentStatusType" NOT NULL DEFAULT 'PENDING',
    "errorMessage" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Payment_orderId_idx" ON "Payment"("orderId");

-- CreateIndex
CREATE INDEX "Payment_transactionId_idx" ON "Payment"("transactionId");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
