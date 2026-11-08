/*
  Warnings:

  - The primary key for the `customeraddress` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `addressLine` on the `customeraddress` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `customeraddress` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `customeraddress` table. All the data in the column will be lost.
  - You are about to drop the column `isDefault` on the `customeraddress` table. All the data in the column will be lost.
  - You are about to drop the column `pincode` on the `customeraddress` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `customeraddress` table. All the data in the column will be lost.
  - The primary key for the `service` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `service` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `service` table. All the data in the column will be lost.
  - You are about to drop the `admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bookings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bookingtechnician` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `customers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `technician` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[serviceName]` on the table `Service` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `CustomerAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressId` to the `CustomerAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceId` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceName` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `bookings` DROP FOREIGN KEY `Bookings_serviceId_fkey`;

-- DropForeignKey
ALTER TABLE `bookings` DROP FOREIGN KEY `Bookings_userId_addressId_fkey`;

-- DropForeignKey
ALTER TABLE `bookings` DROP FOREIGN KEY `Bookings_userId_fkey`;

-- DropForeignKey
ALTER TABLE `bookingtechnician` DROP FOREIGN KEY `BookingTechnician_bookingId_fkey`;

-- DropForeignKey
ALTER TABLE `bookingtechnician` DROP FOREIGN KEY `BookingTechnician_technicianId_fkey`;

-- DropForeignKey
ALTER TABLE `customeraddress` DROP FOREIGN KEY `CustomerAddress_customerId_fkey`;

-- DropIndex
DROP INDEX `CustomerAddress_customerId_id_key` ON `customeraddress`;

-- DropIndex
DROP INDEX `Service_name_key` ON `service`;

-- AlterTable
ALTER TABLE `customeraddress` DROP PRIMARY KEY,
    DROP COLUMN `addressLine`,
    DROP COLUMN `city`,
    DROP COLUMN `id`,
    DROP COLUMN `isDefault`,
    DROP COLUMN `pincode`,
    DROP COLUMN `state`,
    ADD COLUMN `address` VARCHAR(191) NOT NULL,
    ADD COLUMN `addressId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`addressId`);

-- AlterTable
ALTER TABLE `service` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `name`,
    ADD COLUMN `serviceId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `serviceName` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`serviceId`);

-- DropTable
DROP TABLE `admin`;

-- DropTable
DROP TABLE `bookings`;

-- DropTable
DROP TABLE `bookingtechnician`;

-- DropTable
DROP TABLE `customers`;

-- DropTable
DROP TABLE `technician`;

-- CreateTable
CREATE TABLE `Customer` (
    `customerId` INTEGER NOT NULL AUTO_INCREMENT,
    `customerName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phoneNo` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `customerType` ENUM('DOMESTIC', 'COMMERCIAL') NOT NULL,

    UNIQUE INDEX `Customer_email_key`(`email`),
    UNIQUE INDEX `Customer_phoneNo_key`(`phoneNo`),
    PRIMARY KEY (`customerId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Booking` (
    `bookingId` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `serviceId` INTEGER NOT NULL,
    `addressId` INTEGER NOT NULL,
    `bookingDate` DATETIME(3) NOT NULL,
    `expiryDate` DATETIME(3) NOT NULL,
    `status` ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    `price` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`bookingId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Service_serviceName_key` ON `Service`(`serviceName`);

-- AddForeignKey
ALTER TABLE `CustomerAddress` ADD CONSTRAINT `CustomerAddress_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`customerId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`customerId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`serviceId`) ON DELETE RESTRICT ON UPDATE CASCADE;
