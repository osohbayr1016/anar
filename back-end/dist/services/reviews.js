"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Review_1 = __importDefault(require("../models/Review"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// @route   GET /api/reviews/product/:productId
// @desc    Get reviews for a product
// @access  Public
router.get("/product/:productId", async (req, res) => {
    try {
        const reviews = await Review_1.default.find({ productId: req.params.productId }).sort({
            createdAt: -1,
        });
        res.status(200).json({
            success: true,
            reviews,
        });
    }
    catch (error) {
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
router.post("/", auth_1.protect, async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        if (!productId || !rating || !comment) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }
        const review = await Review_1.default.create({
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
    }
    catch (error) {
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
router.delete("/:id", auth_1.protect, async (req, res) => {
    try {
        const review = await Review_1.default.findById(req.params.id);
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
        await Review_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Review deleted",
        });
    }
    catch (error) {
        console.error("Delete review error:", error);
        res.status(500).json({
            success: false,
            message: "Server error deleting review",
        });
    }
});
exports.default = router;
