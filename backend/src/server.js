import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB, prisma } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Inside Render container, public/ is inside backend/
const frontendDistPath = path.resolve(__dirname, "../public");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Disable HTTP caching for all dynamic API responses so changes reflect immediately without stale cache
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  res.set("Surrogate-Control", "no-store");
  next();
});

// Serve frontend static build assets
app.use(express.static(frontendDistPath));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);

// Health check API for Render monitoring
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API is working",
    service: "OM ENTERPRISES Backend",
    timestamp: new Date().toISOString(),
  });
});

// Root API info fallback
app.get("/api", (req, res) => {
  res.json({
    message: "OM ENTERPRISES Pest Control REST API",
    status: "online",
  });
});

// SPA fallback: serves index.html for all non-API client routes (Home, Login, Admin, Profile, Bookings, etc.)
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  const indexPath = path.join(frontendDistPath, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.send("OM ENTERPRISES API is running. Access frontend at its deployed URL.");
    }
  });
});

// Server configuration
const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  await connectDB();

  // Try auto-seeding if database has zero services
  try {
    const serviceCount = await prisma.service.count();
    if (serviceCount === 0) {
      console.log("Empty database detected. Seeding initial Om Enterprises services and accounts...");
      const { seedData } = await import("./seed.js");
      await seedData(false);
    }
  } catch (err) {
    console.log("Database seed check notice:", err.message);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
