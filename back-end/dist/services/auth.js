"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Generate JWT Token
const generateToken = (id, email, role) => {
    return jsonwebtoken_1.default.sign({ id, email, role }, process.env.JWT_SECRET || "your-secret-key", {
        expiresIn: "30d",
    });
};
// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide name, email and password",
            });
        }
        // Check if user exists
        const userExists = await User_1.default.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }
        // Create user
        const user = await User_1.default.create({
            name,
            email,
            password,
        });
        // Generate token
        const token = generateToken(String(user._id), user.email, user.role);
        res.status(201).json({
            success: true,
            token,
            user: {
                id: String(user._id),
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error("Signup error:", error);
        if (error instanceof Error && error.message.includes("E11000")) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Server error during signup",
        });
    }
});
// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password",
            });
        }
        // Check for user (include password for comparison)
        const user = await User_1.default.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        // Check password
        if (!user.password) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        // Generate token
        const token = generateToken(String(user._id), user.email, user.role);
        res.status(200).json({
            success: true,
            token,
            user: {
                id: String(user._id),
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during login",
        });
    }
});
// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get("/me", auth_1.protect, async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user?.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});
exports.default = router;
