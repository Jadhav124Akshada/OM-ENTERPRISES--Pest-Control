import "dotenv/config";

import { PrismaClient } from "../../generated/prisma/client.ts";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

let dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "om_enterprises",
};

// If a connection string is provided (standard for cloud platforms like Render/Aiven/PlanetScale/TiDB)
if (process.env.DATABASE_URL) {
  try {
    const parsed = new URL(process.env.DATABASE_URL);
    dbConfig = {
      host: parsed.hostname,
      port: Number(parsed.port) || 3306,
      user: decodeURIComponent(parsed.username || "root"),
      password: decodeURIComponent(parsed.password || ""),
      database: parsed.pathname.replace(/^\//, "") || "om_enterprises",
    };
  } catch (err) {
    console.warn("Could not parse DATABASE_URL string, falling back to DB_* variables:", err.message);
  }
}

const adapter = new PrismaMariaDb(dbConfig);

export const prisma = new PrismaClient({
  adapter,
});

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("MySQL database connected successfully!");
  } catch (error) {
    console.error("Database connection warning:", error.message);
    console.log("Server will continue running. Please check your DATABASE_URL or database credentials.");
  }
};
