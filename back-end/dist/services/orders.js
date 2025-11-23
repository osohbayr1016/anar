"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Order_1 = __importDefault(require("../models/Order"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Generate order number
const generateOrderNumber = () => {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}-${random}`;
};
// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post("/", auth_1.protect, async (req, res) => {
    try {
        const { items, shippingAddress, totalAmount } = req.body;
        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Order must have at least one item",
            });
        }
        const order = await Order_1.default.create({
            userId: req.user?.id,
            orderNumber: generateOrderNumber(),
            items,
            shippingAddress,
            totalAmount,
        });
        res.status(201).json({
            success: true,
            order,
        });
    }
    catch (error) {
        console.error("Create order error:", error);
        res.status(500).json({
            success: false,
            message: "Server error creating order",
        });
    }
});
// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get("/", auth_1.protect, async (req, res) => {
    try {
        const orders = await Order_1.default.find({ userId: req.user?.id }).sort({
            createdAt: -1,
        });
        res.status(200).json({
            success: true,
            orders,
        });
    }
    catch (error) {
        console.error("Get orders error:", error);
        res.status(500).json({
            success: false,
            message: "Server error fetching orders",
        });
    }
});
// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get("/:id", auth_1.protect, async (req, res) => {
    try {
        const order = await Order_1.default.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }
        if (order.userId !== req.user?.id && req.user?.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Not authorized to view this order",
            });
        }
        res.status(200).json({
            success: true,
            order,
        });
    }
    catch (error) {
        console.error("Get order error:", error);
        res.status(500).json({
            success: false,
            message: "Server error fetching order",
        });
    }
});
// @route   GET /api/orders/admin/all
// @desc    Get all orders (admin only)
// @access  Private/Admin
router.get("/admin/all", auth_1.protect, async (req, res) => {
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Not authorized",
            });
        }
        const orders = await Order_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            orders,
        });
    }
    catch (error) {
        console.error("Get all orders error:", error);
        res.status(500).json({
            success: false,
            message: "Server error fetching orders",
        });
    }
});
// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put("/:id/status", auth_1.protect, async (req, res) => {
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Not authorized",
            });
        }
        const { status } = req.body;
        const order = await Order_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }
        res.status(200).json({
            success: true,
            order,
        });
    }
    catch (error) {
        console.error("Update order error:", error);
        res.status(500).json({
            success: false,
            message: "Server error updating order",
        });
    }
});
exports.default = router;
