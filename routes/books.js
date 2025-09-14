import express from "express"; 
import Book from "../models/Book.js";

const router = express.Router();

// GET /books?search=keyword&category=CategoryName&page=1&limit=20
router.get("/", async (req, res) => {
  try {
    console.log("Query params:", req.query);

    const search = req.query.search || "";
    const category = req.query.category || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    // Build query
    const query = {
      $and: [
        {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { author: { $regex: search, $options: "i" } },
          ],
        },
        category ? { category: { $regex: new RegExp(category, "i") } } : {},
      ],
    };

    // Count total documents
    const totalBooks = await Book.countDocuments(query);

    // Fetch paginated books
    const books = await Book.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      total: totalBooks,
      page,
      limit,
      totalPages: Math.ceil(totalBooks / limit),
      books,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /books/categories → return unique categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Book.distinct("category", { category: { $ne: null, $ne: "" } });
    res.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /books/:id → get a single book by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
