import express from "express";

import { adminLogin, getAdminProfile } from "../controllers/adminController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { addService, getAllServices, updateService, updateServiceStatus, deleteService } from "../controllers/serviceController.js";
import { getAllBookings, updateBookingStatus } from "../controllers/bookingController.js";
import { getAllCustomers } from "../controllers/customerController.js";

const router = express.Router();

// Admin Authentication
router.post("/login", adminLogin);
router.get("/profile", authMiddleware, authorizeRoles("ADMIN"), getAdminProfile);

// Service Management
router.post("/services", authMiddleware, authorizeRoles("ADMIN"), addService);
router.get("/services", authMiddleware, authorizeRoles("ADMIN"), getAllServices);
router.put("/services/:id", authMiddleware, authorizeRoles("ADMIN"), updateService);
router.patch("/services/:id/status", authMiddleware, authorizeRoles("ADMIN"), updateServiceStatus);
router.delete("/services/:id", authMiddleware, authorizeRoles("ADMIN"), deleteService);

// Booking Management
router.get("/bookings", authMiddleware, authorizeRoles("ADMIN"), getAllBookings);
router.patch("/bookings/:bookingId/status", authMiddleware, authorizeRoles("ADMIN"), updateBookingStatus);

// Customer Management
router.get("/customers", authMiddleware, authorizeRoles("ADMIN"), getAllCustomers);

export default router;