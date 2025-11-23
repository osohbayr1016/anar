"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// In-memory mock data for development
const mockProducts = [
    {
        id: "p1",
        name: "Men's Classic Sneakers",
        price: 89,
        imageUrl: "/images/sneakers.jpg",
        category: "Male",
        description: "Comfortable everyday sneakers for men",
        colors: [
            { color: "Black", quantity: 15 },
            { color: "White", quantity: 20 },
            { color: "Blue", quantity: 10 },
        ],
        totalStock: 45,
    },
    {
        id: "p2",
        name: "Men's Cotton T-Shirt",
        price: 35,
        imageUrl: "/images/tshirt.jpg",
        category: "Male",
        description: "Premium quality cotton t-shirt",
        colors: [
            { color: "Black", quantity: 30 },
            { color: "White", quantity: 25 },
            { color: "Gray", quantity: 15 },
        ],
        totalStock: 70,
    },
    {
        id: "p3",
        name: "Men's Denim Jeans",
        price: 79,
        imageUrl: "/images/jeans.jpg",
        category: "Male",
        description: "Classic fit denim jeans",
        colors: [
            { color: "Dark Blue", quantity: 18 },
            { color: "Light Blue", quantity: 12 },
        ],
        totalStock: 30,
    },
    {
        id: "p4",
        name: "Women's Summer Dress",
        price: 95,
        imageUrl: "/images/dress.jpg",
        category: "Female",
        description: "Elegant floral summer dress",
        colors: [
            { color: "Red", quantity: 8 },
            { color: "Blue", quantity: 10 },
            { color: "White", quantity: 12 },
        ],
        totalStock: 30,
    },
    {
        id: "p5",
        name: "Women's Blouse",
        price: 55,
        imageUrl: "/images/blouse.jpg",
        category: "Female",
        description: "Stylish office blouse",
        colors: [
            { color: "White", quantity: 20 },
            { color: "Pink", quantity: 15 },
        ],
        totalStock: 35,
    },
    {
        id: "p6",
        name: "Women's Handbag",
        price: 120,
        imageUrl: "/images/handbag.jpg",
        category: "Female",
        description: "Leather handbag with multiple compartments",
        colors: [
            { color: "Black", quantity: 5 },
            { color: "Brown", quantity: 8 },
            { color: "Beige", quantity: 7 },
        ],
        totalStock: 20,
    },
    {
        id: "p7",
        name: "Kids Colorful T-Shirt",
        price: 25,
        imageUrl: "/images/kids-tshirt.jpg",
        category: "Children",
        description: "Fun and colorful t-shirt for kids",
        colors: [
            { color: "Red", quantity: 15 },
            { color: "Blue", quantity: 15 },
            { color: "Green", quantity: 10 },
        ],
        totalStock: 40,
    },
    {
        id: "p8",
        name: "Kids Sneakers",
        price: 45,
        imageUrl: "/images/kids-sneakers.jpg",
        category: "Children",
        description: "Durable sneakers for active kids",
        colors: [
            { color: "Pink", quantity: 12 },
            { color: "Blue", quantity: 13 },
        ],
        totalStock: 25,
    },
    {
        id: "p9",
        name: "Kids Backpack",
        price: 35,
        imageUrl: "/images/kids-backpack.jpg",
        category: "Children",
        description: "School backpack with fun design",
        colors: [
            { color: "Red", quantity: 10 },
            { color: "Blue", quantity: 8 },
            { color: "Green", quantity: 7 },
        ],
        totalStock: 25,
    },
];
const router = (0, express_1.Router)();
// List products
router.get("/", (_req, res) => {
    res.json(mockProducts);
});
// Get product by id
router.get("/:id", (req, res) => {
    const product = mockProducts.find((p) => p.id === req.params.id);
    if (!product)
        return res.status(404).json({ message: "Not found" });
    res.json(product);
});
// Create product
router.post("/", (req, res) => {
    const payload = req.body;
    if (!payload.name || payload.price == null || !payload.category) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    const newProduct = {
        id: `p${Date.now()}`,
        name: payload.name,
        price: Number(payload.price),
        category: payload.category,
        imageUrl: payload.imageUrl || "/images/placeholder.jpg",
        description: payload.description,
    };
    mockProducts.push(newProduct);
    res.status(201).json(newProduct);
});
// Update product
router.put("/:id", (req, res) => {
    const index = mockProducts.findIndex((p) => p.id === req.params.id);
    if (index === -1)
        return res.status(404).json({ message: "Not found" });
    const current = mockProducts[index];
    const payload = req.body;
    const updated = { ...current, ...payload, id: current.id };
    mockProducts[index] = updated;
    res.json(updated);
});
// Delete product
router.delete("/:id", (req, res) => {
    const index = mockProducts.findIndex((p) => p.id === req.params.id);
    if (index === -1)
        return res.status(404).json({ message: "Not found" });
    const removed = mockProducts.splice(index, 1)[0];
    res.json(removed);
});
exports.default = router;
