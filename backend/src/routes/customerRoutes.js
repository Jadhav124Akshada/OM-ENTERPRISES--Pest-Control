import express from "express";


import { authMiddleware } from "../middleware/authMiddleware.js";

import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  getMyProfile,
  addAddress,
  getMyAddresses,
  updateAddress,
  deleteAddress,
} from "../controllers/customerController.js";

const router = express.Router();





// Customer profile
router.get(
  "/profile",
  authMiddleware,
  authorizeRoles("CUSTOMER"),
  getMyProfile
);

// Add address
router.post(
  "/addresses",
  authMiddleware,
  authorizeRoles("CUSTOMER"),
  addAddress
);

// Get all addresses
router.get(
  "/addresses",
  authMiddleware,
  authorizeRoles("CUSTOMER"),
  getMyAddresses
);

// Update address
router.put(
  "/addresses/:addressId",
  authMiddleware,
  authorizeRoles("CUSTOMER"),
  updateAddress
);

// Delete address
router.delete(
  "/addresses/:addressId",
  authMiddleware,
  authorizeRoles("CUSTOMER"),
  deleteAddress
);

export default router;
