"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Ticket_1 = __importDefault(require("../models/Ticket"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// @route   POST /api/tickets
// @desc    Create a support ticket
// @access  Private
router.post("/", auth_1.protect, async (req, res) => {
    try {
        const { subject, message, priority } = req.body;
        if (!subject || !message) {
            return res.status(400).json({
                success: false,
                message: "Subject and message are required",
            });
        }
        const ticket = await Ticket_1.default.create({
            userId: req.user?.id,
            userEmail: req.user?.email,
            subject,
            message,
            priority: priority || "medium",
        });
        res.status(201).json({
            success: true,
            ticket,
        });
    }
    catch (error) {
        console.error("Create ticket error:", error);
        res.status(500).json({
            success: false,
            message: "Server error creating ticket",
        });
    }
});
// @route   GET /api/tickets
// @desc    Get user's tickets
// @access  Private
router.get("/", auth_1.protect, async (req, res) => {
    try {
        const tickets = await Ticket_1.default.find({ userId: req.user?.id }).sort({
            createdAt: -1,
        });
        res.status(200).json({
            success: true,
            tickets,
        });
    }
    catch (error) {
        console.error("Get tickets error:", error);
        res.status(500).json({
            success: false,
            message: "Server error fetching tickets",
        });
    }
});
// @route   GET /api/tickets/admin/all
// @desc    Get all tickets (admin)
// @access  Private/Admin
router.get("/admin/all", auth_1.protect, async (req, res) => {
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Not authorized",
            });
        }
        const tickets = await Ticket_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            tickets,
        });
    }
    catch (error) {
        console.error("Get all tickets error:", error);
        res.status(500).json({
            success: false,
            message: "Server error fetching tickets",
        });
    }
});
// @route   PUT /api/tickets/:id
// @desc    Update ticket status
// @access  Private/Admin
router.put("/:id", auth_1.protect, async (req, res) => {
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Not authorized",
            });
        }
        const { status, priority } = req.body;
        const ticket = await Ticket_1.default.findByIdAndUpdate(req.params.id, { status, priority }, { new: true });
        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }
        res.status(200).json({
            success: true,
            ticket,
        });
    }
    catch (error) {
        console.error("Update ticket error:", error);
        res.status(500).json({
            success: false,
            message: "Server error updating ticket",
        });
    }
});
exports.default = router;
