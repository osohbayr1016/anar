import { Router, Request, Response } from "express";
import Review from "../models/Review";
import { protect, AuthRequest } from "../middleware/auth";

const router = Router();

// @route   GET /api/reviews/product/:productId
// @desc    Get reviews for a product
// @access  Public
router.get("/product/:productId", async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort(
      {
        createdAt: -1,
      }
    );

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching reviews",
    });
  }
});

// @route   POST /api/reviews
// @desc    Create a review
// @access  Private
router.post("/", protect, async (req: AuthRequest, res: Response) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const review = await Review.create({
      productId,
      userId: req.user?.id,
      userName: req.user?.email.split("@")[0] || "Anonymous",
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      review,
    });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating review",
    });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete("/:id", protect, async (req: AuthRequest, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.userId !== req.user?.id && req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Review deleted",
    });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting review",
    });
  }
});

export default router;
