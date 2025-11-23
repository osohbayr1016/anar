import { Router, Request, Response } from "express";
import Ticket from "../models/Ticket";
import { protect, AuthRequest } from "../middleware/auth";

const router = Router();

// @route   POST /api/tickets
// @desc    Create a support ticket
// @access  Private
router.post("/", protect, async (req: AuthRequest, res: Response) => {
  try {
    const { subject, message, priority } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Subject and message are required",
      });
    }

    const ticket = await Ticket.create({
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
  } catch (error) {
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
router.get("/", protect, async (req: AuthRequest, res: Response) => {
  try {
    const tickets = await Ticket.find({ userId: req.user?.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      tickets,
    });
  } catch (error) {
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
router.get("/admin/all", protect, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const tickets = await Ticket.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      tickets,
    });
  } catch (error) {
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
router.put("/:id", protect, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const { status, priority } = req.body;
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status, priority },
      { new: true }
    );

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
  } catch (error) {
    console.error("Update ticket error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating ticket",
    });
  }
});

export default router;


