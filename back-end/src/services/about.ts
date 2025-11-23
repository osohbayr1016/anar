import { Router, Request, Response } from "express";
import About from "../models/About";
import { protect, authorize, AuthRequest } from "../middleware/auth";

const router = Router();

// @route   GET /api/about
// @desc    Get about page content
// @access  Public
router.get("/", async (req: Request, res: Response) => {
  try {
    const about = await About.findOne();
    if (!about) {
      // Create default about content if none exists
      const defaultAbout = await About.create({});
      return res.status(200).json({
        success: true,
        data: defaultAbout,
      });
    }
    res.status(200).json({
      success: true,
      data: about,
    });
  } catch (error) {
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
router.put("/", protect, authorize("admin"), async (req: Request, res: Response) => {
  try {
    let about = await About.findOne();
    
    if (!about) {
      about = await About.create(req.body);
    } else {
      about = await About.findOneAndUpdate({}, req.body, {
        new: true,
        runValidators: true,
      });
    }

    res.status(200).json({
      success: true,
      data: about,
    });
  } catch (error) {
    console.error("Update about error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;

