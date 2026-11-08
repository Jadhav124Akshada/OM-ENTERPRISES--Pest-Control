-- AlterTable
ALTER TABLE `booking` ADD COLUMN `completedAt` DATETIME(3) NULL,
    MODIFY `bookingDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `expiryDate` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `service` ADD COLUMN `validity` INTEGER NOT NULL DEFAULT 30;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `CustomerAddress`(`addressId`) ON DELETE RESTRICT ON UPDATE CASCADE;
