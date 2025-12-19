import { Router, Request, Response } from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary";
import { protect, authorize, AuthRequest } from "../middleware/auth";
import { Readable } from "stream";

const router = Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (
  buffer: Buffer,
  folder: string = "anar-shop"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error("Upload failed"));
        }
      }
    );

    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
};

// @route   POST /api/upload
// @desc    Upload image to Cloudinary
// @access  Private/Admin
router.post(
  "/",
  protect,
  authorize("admin"),
  upload.single("image"),
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image file provided",
        });
      }

      const imageUrl = await uploadToCloudinary(
        req.file.buffer,
        "anar-shop/products"
      );

      res.status(200).json({
        success: true,
        imageUrl,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Server error uploading image",
      });
    }
  }
);

// @route   POST /api/upload/multiple
// @desc    Upload multiple images to Cloudinary
// @access  Private/Admin
router.post(
  "/multiple",
  protect,
  authorize("admin"),
  upload.array("images", 10),
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No image files provided",
        });
      }

      const files = req.files as Express.Multer.File[];
      const uploadPromises = files.map((file) =>
        uploadToCloudinary(file.buffer, "anar-shop/products")
      );

      const imageUrls = await Promise.all(uploadPromises);

      res.status(200).json({
        success: true,
        imageUrls,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Server error uploading images",
      });
    }
  }
);

// @route   DELETE /api/upload
// @desc    Delete image from Cloudinary
// @access  Private/Admin
router.delete(
  "/",
  protect,
  authorize("admin"),
  async (req: AuthRequest, res: Response) => {
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

      await cloudinary.uploader.destroy(publicId);

      res.status(200).json({
        success: true,
        message: "Image deleted successfully",
      });
    } catch (error) {
      console.error("Delete image error:", error);
      res.status(500).json({
        success: false,
        message: "Server error deleting image",
      });
    }
  }
);

export default router;
