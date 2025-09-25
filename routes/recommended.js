import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import recommendedController from "../controllers/recommended.js";

const { recommend, getAll } = recommendedController;
const router = express.Router();

// POST /api/recommended (logged-in user recommends a book)
router.post("/", authMiddleware, recommend);

// GET /api/recommended (anyone can see recommended list)
router.get("/", getAll);

export default router;