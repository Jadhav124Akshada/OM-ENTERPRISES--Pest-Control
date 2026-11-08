import "dotenv/config";

import { PrismaClient } from "../../generated/prisma/client.ts";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// Default TiDB Cloud Starter credentials
const TIDB_DEFAULTS = {
  host: "gateway01.ap-northeast-1.prod.aws.tidbcloud.com",
  port: 4000,
  user: "48kDNN3vvieGiCA.root",
  password: "Au3ATRtyyReSD1VN",
  database: "test",
  ssl: { rejectUnauthorized: false },
};

let dbConfig = {
  host: process.env.DB_HOST || TIDB_DEFAULTS.host,
  port: Number(process.env.DB_PORT) || TIDB_DEFAULTS.port,
  user: process.env.DB_USER || TIDB_DEFAULTS.user,
  password: process.env.DB_PASSWORD !== undefined && process.env.DB_PASSWORD !== "" ? process.env.DB_PASSWORD : TIDB_DEFAULTS.password,
  database: process.env.DB_NAME || TIDB_DEFAULTS.database,
  ssl: { rejectUnauthorized: false },
};

// If a connection string is provided or use default TiDB URL
const connUrl = process.env.DATABASE_URL || `mysql://${TIDB_DEFAULTS.user}:${TIDB_DEFAULTS.password}@${TIDB_DEFAULTS.host}:${TIDB_DEFAULTS.port}/${TIDB_DEFAULTS.database}`;

if (connUrl) {
  try {
    const parsed = new URL(connUrl);
    dbConfig = {
      host: parsed.hostname || TIDB_DEFAULTS.host,
      port: Number(parsed.port) || (parsed.hostname.includes("tidbcloud.com") ? 4000 : 3306),
      user: decodeURIComponent(parsed.username || TIDB_DEFAULTS.user),
      password: decodeURIComponent(parsed.password || TIDB_DEFAULTS.password),
      database: parsed.pathname.replace(/^\//, "") || TIDB_DEFAULTS.database,
      ssl: { rejectUnauthorized: false },
    };
  } catch (err) {
    console.warn("Could not parse DATABASE_URL string, falling back to DB_* variables:", err.message);
  }
}

// Automatically configure SSL and port 4000 if connecting to TiDB Cloud
if (dbConfig.host && dbConfig.host.includes("tidbcloud.com")) {
  dbConfig.ssl = { rejectUnauthorized: false };
  if (!dbConfig.port || dbConfig.port === 3306) {
    dbConfig.port = 4000;
  }
}

const adapter = new PrismaMariaDb(dbConfig);

export const prisma = new PrismaClient({
  adapter,
});

export const initSchema = async () => {
  try {
    // 1. Admin table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`Admin\` (
        \`adminId\` INT AUTO_INCREMENT PRIMARY KEY,
        \`adminName\` VARCHAR(191) NOT NULL,
        \`email\` VARCHAR(191) NOT NULL UNIQUE,
        \`phoneNo\` VARCHAR(191) UNIQUE,
        \`password\` VARCHAR(191) NOT NULL,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
      );
    `);

    // 2. Customer table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`Customer\` (
        \`customerId\` INT AUTO_INCREMENT PRIMARY KEY,
        \`customerName\` VARCHAR(191) NOT NULL,
        \`email\` VARCHAR(191) UNIQUE,
        \`phoneNo\` VARCHAR(191) NOT NULL UNIQUE,
        \`password\` VARCHAR(191) NOT NULL,
        \`customerType\` ENUM('DOMESTIC', 'COMMERCIAL') NOT NULL
      );
    `);

    // 3. CustomerAddress table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`CustomerAddress\` (
        \`addressId\` INT AUTO_INCREMENT PRIMARY KEY,
        \`customerId\` INT NOT NULL,
        \`address\` VARCHAR(191) NOT NULL,
        INDEX \`CustomerAddress_customerId_idx\` (\`customerId\`)
      );
    `);

    // 4. Service table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`Service\` (
        \`serviceId\` INT AUTO_INCREMENT PRIMARY KEY,
        \`serviceName\` VARCHAR(191) NOT NULL UNIQUE,
        \`description\` TEXT NOT NULL,
        \`price\` DECIMAL(10, 2) NOT NULL,
        \`validity\` INT NOT NULL DEFAULT 30,
        \`isActive\` BOOLEAN NOT NULL DEFAULT TRUE
      );
    `);

    // 5. Booking table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`Booking\` (
        \`bookingId\` INT AUTO_INCREMENT PRIMARY KEY,
        \`customerId\` INT NOT NULL,
        \`serviceId\` INT NOT NULL,
        \`addressId\` INT NOT NULL,
        \`bookingDate\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`completedAt\` DATETIME(3) NULL,
        \`expiryDate\` DATETIME(3) NULL,
        \`status\` ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
        \`price\` DECIMAL(10, 2) NOT NULL,
        INDEX \`Booking_customerId_idx\` (\`customerId\`),
        INDEX \`Booking_serviceId_idx\` (\`serviceId\`),
        INDEX \`Booking_addressId_idx\` (\`addressId\`)
      );
    `);

    // 6. Technician table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`Technician\` (
        \`technicianId\` INT AUTO_INCREMENT PRIMARY KEY,
        \`technicianName\` VARCHAR(191) NOT NULL,
        \`email\` VARCHAR(191) UNIQUE,
        \`phoneNo\` VARCHAR(191) NOT NULL UNIQUE,
        \`password\` VARCHAR(191) NOT NULL,
        \`isActive\` BOOLEAN NOT NULL DEFAULT TRUE,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
      );
    `);

    console.log("Database schema verified and tables initialized!");
  } catch (schemaErr) {
    console.warn("Schema auto-initialization notice:", schemaErr.message);
  }
};

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("MySQL/TiDB database connected successfully!");
    await initSchema();
  } catch (error) {
    console.error("Database connection warning:", error.message);
    console.log("Server will continue running. Please check your DATABASE_URL or database credentials.");
  }
};
