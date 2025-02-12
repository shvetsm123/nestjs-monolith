-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "is_paid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "payment_intent_id" TEXT,
ADD COLUMN     "total_amount" INTEGER NOT NULL DEFAULT 0;
