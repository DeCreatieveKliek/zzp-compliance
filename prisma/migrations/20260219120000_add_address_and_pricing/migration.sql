-- AlterTable: add address fields to User
ALTER TABLE "User" ADD COLUMN "street" TEXT;
ALTER TABLE "User" ADD COLUMN "houseNumber" TEXT;
ALTER TABLE "User" ADD COLUMN "postalCode" TEXT;
ALTER TABLE "User" ADD COLUMN "city" TEXT;

-- AlterTable: update Payment default amount to €10.00 (1000 cents)
ALTER TABLE "Payment" ALTER COLUMN "amount" SET DEFAULT 1000;

-- AlterTable: update Invoice defaults and add address fields
ALTER TABLE "Invoice" ALTER COLUMN "amount" SET DEFAULT 826;
ALTER TABLE "Invoice" ALTER COLUMN "vatAmount" SET DEFAULT 174;
ALTER TABLE "Invoice" ALTER COLUMN "totalAmount" SET DEFAULT 1000;
ALTER TABLE "Invoice" ADD COLUMN "customerStreet" TEXT;
ALTER TABLE "Invoice" ADD COLUMN "customerHouseNumber" TEXT;
ALTER TABLE "Invoice" ADD COLUMN "customerPostalCode" TEXT;
ALTER TABLE "Invoice" ADD COLUMN "customerCity" TEXT;
