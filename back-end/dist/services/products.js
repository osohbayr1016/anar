"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Product_1 = __importDefault(require("../models/Product"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get("/", async (req, res) => {
    try {
        const { category } = req.query;
        const query = category ? { category } : {};
        const products = await Product_1.default.find(query).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            products,
        });
    }
    catch (error) {
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
router.get("/:id", async (req, res) => {
    try {
        const product = await Product_1.default.findById(req.params.id);
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
    }
    catch (error) {
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
router.post("/", auth_1.protect, (0, auth_1.authorize)("admin"), async (req, res) => {
    try {
        const { name, price, imageUrl, category, description, colors } = req.body;
        if (!name || !price || !imageUrl || !category) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }
        const product = await Product_1.default.create({
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
    }
    catch (error) {
        console.error("Create product error:", error);
        res.status(500).json({
            success: false,
            message: "Server error creating product",
        });
    }
});
// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Admin
router.put("/:id", auth_1.protect, (0, auth_1.authorize)("admin"), async (req, res) => {
    try {
        const product = await Product_1.default.findByIdAndUpdate(req.params.id, req.body, {
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
    }
    catch (error) {
        console.error("Update product error:", error);
        res.status(500).json({
            success: false,
            message: "Server error updating product",
        });
    }
});
// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Admin
router.delete("/:id", auth_1.protect, (0, auth_1.authorize)("admin"), async (req, res) => {
    try {
        const product = await Product_1.default.findByIdAndDelete(req.params.id);
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
    }
    catch (error) {
        console.error("Delete product error:", error);
        res.status(500).json({
            success: false,
            message: "Server error deleting product",
        });
    }
});
exports.default = router;
