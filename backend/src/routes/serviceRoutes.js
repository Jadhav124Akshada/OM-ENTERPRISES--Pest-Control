import express from "express";
import { getAllServices } from "../controllers/serviceController.js";

const router = express.Router();

// Public route to view all available services (for visitors and customers)
router.get("/", getAllServices);

export default router;
