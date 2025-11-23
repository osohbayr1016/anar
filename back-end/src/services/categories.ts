import { Router, Request, Response } from "express";
import Category from "../models/Category";
import { protect, AuthRequest, authorize } from "../middleware/auth";

const router = Router();

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get("/", async (_req: Request, res: Response) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching categories",
    });
  }
});

// @route   POST /api/categories
// @desc    Create a category
// @access  Private/Admin
router.post(
  "/",
  protect,
  authorize("admin"),
  async (req: AuthRequest, res: Response) => {
    try {
      const { name, description, colorGradient, icon } = req.body;

      if (!name || !description) {
        return res.status(400).json({
          success: false,
          message: "Name and description are required",
        });
      }

      const slug = name.toLowerCase().replace(/\s+/g, "-");

      const existingCategory = await Category.findOne({ slug });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: "Category already exists",
        });
      }

      const category = await Category.create({
        name,
        slug,
        description,
        colorGradient: colorGradient || "from-gray-100 to-gray-200",
        icon: icon || "📦",
      });

      res.status(201).json({
        success: true,
        category,
      });
    } catch (error) {
      console.error("Create category error:", error);
      res.status(500).json({
        success: false,
        message: "Server error creating category",
      });
    }
  }
);

// @route   PUT /api/categories/:id
// @desc    Update a category
// @access  Private/Admin
router.put(
  "/:id",
  protect,
  authorize("admin"),
  async (req: AuthRequest, res: Response) => {
    try {
      const category = await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      res.status(200).json({
        success: true,
        category,
      });
    } catch (error) {
      console.error("Update category error:", error);
      res.status(500).json({
        success: false,
        message: "Server error updating category",
      });
    }
  }
);

// @route   DELETE /api/categories/:id
// @desc    Delete a category
// @access  Private/Admin
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  async (req: AuthRequest, res: Response) => {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Category deleted",
      });
    } catch (error) {
      console.error("Delete category error:", error);
      res.status(500).json({
        success: false,
        message: "Server error deleting category",
      });
    }
  }
);

export default router;


