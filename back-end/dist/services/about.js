"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const About_1 = __importDefault(require("../models/About"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// @route   GET /api/about
// @desc    Get about page content
// @access  Public
router.get("/", async (req, res) => {
    try {
        const about = await About_1.default.findOne();
        if (!about) {
            // Create default about content if none exists
            const defaultAbout = await About_1.default.create({});
            return res.status(200).json({
                success: true,
                data: defaultAbout,
            });
        }
        res.status(200).json({
            success: true,
            data: about,
        });
    }
    catch (error) {
        console.error("Get about error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});
// @route   PUT /api/about
// @desc    Update about page content
// @access  Private/Admin
router.put("/", auth_1.protect, (0, auth_1.authorize)("admin"), async (req, res) => {
    try {
        let about = await About_1.default.findOne();
        if (!about) {
            about = await About_1.default.create(req.body);
        }
        else {
            about = await About_1.default.findOneAndUpdate({}, req.body, {
                new: true,
                runValidators: true,
            });
        }
        res.status(200).json({
            success: true,
            data: about,
        });
    }
    catch (error) {
        console.error("Update about error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});
exports.default = router;
