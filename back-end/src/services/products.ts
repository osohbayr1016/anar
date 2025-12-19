import { Router, Request, Response } from "express";
import Product from "../models/Product";
import { protect, authorize, AuthRequest } from "../middleware/auth";

const router = Router();

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get("/", async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching products",
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching product",
    });
  }
});

// @route   POST /api/products
// @desc    Create a product
// @access  Private/Admin
router.post(
  "/",
  protect,
  authorize("admin"),
  async (req: AuthRequest, res: Response) => {
    try {
      const { name, price, imageUrl, category, description, colors } = req.body;

      if (!name || !price || !imageUrl || !category) {
        return res.status(400).json({
          success: false,
          message: "Please provide all required fields",
        });
      }

      const product = await Product.create({
        name,
        price,
        imageUrl,
        category,
        description,
        colors,
      });

      res.status(201).json({
        success: true,
        product,
      });
    } catch (error) {
      console.error("Create product error:", error);
      res.status(500).json({
        success: false,
        message: "Server error creating product",
      });
    }
  }
);

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Admin
router.put(
  "/:id",
  protect,
  authorize("admin"),
  async (req: AuthRequest, res: Response) => {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      console.error("Update product error:", error);
      res.status(500).json({
        success: false,
        message: "Server error updating product",
      });
    }
  }
);

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Admin
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  async (req: AuthRequest, res: Response) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Product deleted",
      });
    } catch (error) {
      console.error("Delete product error:", error);
      res.status(500).json({
        success: false,
        message: "Server error deleting product",
      });
    }
  }
);

export default router;
