"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = void 0;
const store = {};
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = process.env.NODE_ENV === "production" ? 100 : 1000;
const rateLimiter = (req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress;
    const forwarded = req.headers["x-forwarded-for"];
    const clientId = Array.isArray(forwarded)
        ? forwarded[0]
        : typeof forwarded === "string"
            ? forwarded
            : typeof ip === "string"
                ? ip
                : "unknown";
    const now = Date.now();
    const clientData = store[clientId];
    if (!clientData || now > clientData.resetTime) {
        store[clientId] = {
            count: 1,
            resetTime: now + RATE_LIMIT_WINDOW,
        };
        return next();
    }
    if (clientData.count >= MAX_REQUESTS) {
        return res.status(429).json({
            success: false,
            error: {
                message: "Too many requests, please try again later.",
            },
        });
    }
    clientData.count++;
    next();
    // Clean up old entries periodically
    if (Math.random() < 0.01) {
        Object.keys(store).forEach((key) => {
            if (store[key].resetTime < now) {
                delete store[key];
            }
        });
    }
};
exports.rateLimiter = rateLimiter;
