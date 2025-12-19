"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const auth_1 = require("../middleware/auth");
const stream_1 = require("stream");
const router = (0, express_1.Router)();
// Configure multer for memory storage
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        }
        else {
            cb(new Error("Only image files are allowed"));
        }
    },
});
// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder = "anar-shop") => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.default.uploader.upload_stream({
            folder,
            resource_type: "image",
        }, (error, result) => {
            if (error) {
                reject(error);
            }
            else if (result) {
                resolve(result.secure_url);
            }
            else {
                reject(new Error("Upload failed"));
            }
        });
        const readableStream = new stream_1.Readable();
        readableStream.push(buffer);
        readableStream.push(null);
        readableStream.pipe(uploadStream);
    });
};
// @route   POST /api/upload
// @desc    Upload image to Cloudinary
// @access  Private/Admin
router.post("/", auth_1.protect, (0, auth_1.authorize)("admin"), upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image file provided",
            });
        }
        const imageUrl = await uploadToCloudinary(req.file.buffer, "anar-shop/products");
        res.status(200).json({
            success: true,
            imageUrl,
        });
    }
    catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Server error uploading image",
        });
    }
});
// @route   POST /api/upload/multiple
// @desc    Upload multiple images to Cloudinary
// @access  Private/Admin
router.post("/multiple", auth_1.protect, (0, auth_1.authorize)("admin"), upload.array("images", 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No image files provided",
            });
        }
        const files = req.files;
        const uploadPromises = files.map((file) => uploadToCloudinary(file.buffer, "anar-shop/products"));
        const imageUrls = await Promise.all(uploadPromises);
        res.status(200).json({
            success: true,
            imageUrls,
        });
    }
    catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Server error uploading images",
        });
    }
});
// @route   DELETE /api/upload
// @desc    Delete image from Cloudinary
// @access  Private/Admin
router.delete("/", auth_1.protect, (0, auth_1.authorize)("admin"), async (req, res) => {
    try {
        const { imageUrl } = req.body;
        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: "Image URL is required",
            });
        }
        // Extract public_id from Cloudinary URL
        const urlParts = imageUrl.split("/");
        const filename = urlParts[urlParts.length - 1];
        const publicId = `anar-shop/products/${filename.split(".")[0]}`;
        await cloudinary_1.default.uploader.destroy(publicId);
        res.status(200).json({
            success: true,
            message: "Image deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete image error:", error);
        res.status(500).json({
            success: false,
            message: "Server error deleting image",
        });
    }
});
exports.default = router;
