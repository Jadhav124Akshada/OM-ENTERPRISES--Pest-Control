-- CreateTable
CREATE TABLE `Admin` (
    `adminId` INTEGER NOT NULL AUTO_INCREMENT,
    `adminName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phoneNo` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Admin_email_key`(`email`),
    UNIQUE INDEX `Admin_phoneNo_key`(`phoneNo`),
    PRIMARY KEY (`adminId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Technician` (
    `technicianId` INTEGER NOT NULL AUTO_INCREMENT,
    `technicianName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phoneNo` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Technician_email_key`(`email`),
    UNIQUE INDEX `Technician_phoneNo_key`(`phoneNo`),
    PRIMARY KEY (`technicianId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
