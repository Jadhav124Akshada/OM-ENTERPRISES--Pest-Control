import express from "express";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  completeBooking
} from "../controllers/bookingController.js";

const router = express.Router();

// ========================================
// CUSTOMER ROUTES
// ========================================

// Create booking
router.post(
  "/",
  authMiddleware,
  authorizeRoles("CUSTOMER"),
  createBooking
);

// Get all bookings of logged-in customer
router.get(
  "/my-bookings",
  authMiddleware,
  authorizeRoles("CUSTOMER"),
  getMyBookings
);

// Get booking details
router.get(
  "/:bookingId",
  authMiddleware,
  authorizeRoles("CUSTOMER"),
  getBookingById
);

// Cancel booking
router.patch(
  "/:bookingId/cancel",
  authMiddleware,
  authorizeRoles("CUSTOMER"),
  cancelBooking
);


// ========================================
// ADMIN ROUTES
// ========================================

// Complete booking and automatically calculate expiry date
router.patch(
  "/:bookingId/complete",
  authMiddleware,
  authorizeRoles("ADMIN"),
  completeBooking
);

export default router;