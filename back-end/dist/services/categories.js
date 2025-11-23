"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Category_1 = __importDefault(require("../models/Category"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get("/", async (_req, res) => {
    try {
        const categories = await Category_1.default.find({ isActive: true }).sort({
            createdAt: -1,
        });
        res.status(200).json({
            success: true,
            categories,
        });
    }
    catch (error) {
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
router.post("/", auth_1.protect, (0, auth_1.authorize)("admin"), async (req, res) => {
    try {
        const { name, description, colorGradient, icon } = req.body;
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "Name and description are required",
            });
        }
        const slug = name.toLowerCase().replace(/\s+/g, "-");
        const existingCategory = await Category_1.default.findOne({ slug });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "Category already exists",
            });
        }
        const category = await Category_1.default.create({
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
    }
    catch (error) {
        console.error("Create category error:", error);
        res.status(500).json({
            success: false,
            message: "Server error creating category",
        });
    }
});
// @route   PUT /api/categories/:id
// @desc    Update a category
// @access  Private/Admin
router.put("/:id", auth_1.protect, (0, auth_1.authorize)("admin"), async (req, res) => {
    try {
        const category = await Category_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
    }
    catch (error) {
        console.error("Update category error:", error);
        res.status(500).json({
            success: false,
            message: "Server error updating category",
        });
    }
});
// @route   DELETE /api/categories/:id
// @desc    Delete a category
// @access  Private/Admin
router.delete("/:id", auth_1.protect, (0, auth_1.authorize)("admin"), async (req, res) => {
    try {
        const category = await Category_1.default.findByIdAndDelete(req.params.id);
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
    }
    catch (error) {
        console.error("Delete category error:", error);
        res.status(500).json({
            success: false,
            message: "Server error deleting category",
        });
    }
});
exports.default = router;
