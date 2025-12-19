import dotenv from "dotenv";
import connectDB from "../config/database";
import Product from "../models/Product";
import Category from "../models/Category";
import User from "../models/User";
import About from "../models/About";

dotenv.config();

const seedProducts = async () => {
  const products = [
    {
      name: "Men's Classic Sneakers",
      price: 89,
      imageUrl: "/images/sneakers.jpg",
      category: "Male" as const,
      description: "Comfortable everyday sneakers for men",
      colors: [
        { color: "Black", quantity: 15 },
        { color: "White", quantity: 20 },
        { color: "Blue", quantity: 10 },
      ],
    },
    {
      name: "Men's Cotton T-Shirt",
      price: 35,
      imageUrl: "/images/tshirt.jpg",
      category: "Male" as const,
      description: "Premium quality cotton t-shirt",
      colors: [
        { color: "Black", quantity: 30 },
        { color: "White", quantity: 25 },
        { color: "Gray", quantity: 15 },
      ],
    },
    {
      name: "Men's Denim Jeans",
      price: 79,
      imageUrl: "/images/jeans.jpg",
      category: "Male" as const,
      description: "Classic fit denim jeans",
      colors: [
        { color: "Dark Blue", quantity: 18 },
        { color: "Light Blue", quantity: 12 },
      ],
    },
    {
      name: "Women's Summer Dress",
      price: 95,
      imageUrl: "/images/dress.jpg",
      category: "Female" as const,
      description: "Elegant floral summer dress",
      colors: [
        { color: "Red", quantity: 8 },
        { color: "Blue", quantity: 10 },
        { color: "White", quantity: 12 },
      ],
    },
    {
      name: "Women's Blouse",
      price: 55,
      imageUrl: "/images/blouse.jpg",
      category: "Female" as const,
      description: "Stylish office blouse",
      colors: [
        { color: "White", quantity: 20 },
        { color: "Pink", quantity: 15 },
      ],
    },
    {
      name: "Women's Handbag",
      price: 120,
      imageUrl: "/images/handbag.jpg",
      category: "Female" as const,
      description: "Leather handbag with multiple compartments",
      colors: [
        { color: "Black", quantity: 5 },
        { color: "Brown", quantity: 8 },
        { color: "Beige", quantity: 7 },
      ],
    },
    {
      name: "Kids Colorful T-Shirt",
      price: 25,
      imageUrl: "/images/kids-tshirt.jpg",
      category: "Children" as const,
      description: "Fun and colorful t-shirt for kids",
      colors: [
        { color: "Red", quantity: 15 },
        { color: "Blue", quantity: 15 },
        { color: "Green", quantity: 10 },
      ],
    },
    {
      name: "Kids Sneakers",
      price: 45,
      imageUrl: "/images/kids-sneakers.jpg",
      category: "Children" as const,
      description: "Durable sneakers for active kids",
      colors: [
        { color: "Pink", quantity: 12 },
        { color: "Blue", quantity: 13 },
      ],
    },
    {
      name: "Kids Backpack",
      price: 35,
      imageUrl: "/images/kids-backpack.jpg",
      category: "Children" as const,
      description: "School backpack with fun design",
      colors: [
        { color: "Red", quantity: 10 },
        { color: "Blue", quantity: 8 },
        { color: "Green", quantity: 7 },
      ],
    },
  ];

  const existingProducts = await Product.countDocuments();
  if (existingProducts > 0) {
    console.log("Products already exist, skipping seed...");
    return;
  }

  await Product.insertMany(products);
  console.log(`✓ Seeded ${products.length} products`);
};

const seedCategories = async () => {
  const categories = [
    {
      name: "Male",
      slug: "male",
      description: "Men's fashion and clothing",
      colorGradient: "from-blue-100 to-blue-200",
      icon: "👔",
      isActive: true,
    },
    {
      name: "Female",
      slug: "female",
      description: "Women's fashion and clothing",
      colorGradient: "from-pink-100 to-pink-200",
      icon: "👗",
      isActive: true,
    },
    {
      name: "Children",
      slug: "children",
      description: "Kids fashion and clothing",
      colorGradient: "from-yellow-100 to-yellow-200",
      icon: "🧸",
      isActive: true,
    },
    {
      name: "Accessories",
      slug: "accessories",
      description: "Complete your look with stylish accessories",
      colorGradient: "from-purple-100 to-purple-200",
      icon: "👜",
      isActive: true,
    },
  ];

  const existingCategories = await Category.countDocuments();
  if (existingCategories > 0) {
    console.log("Categories already exist, skipping seed...");
    return;
  }

  await Category.insertMany(categories);
  console.log(`✓ Seeded ${categories.length} categories`);
};

const seedUsers = async () => {
  const existingUsers = await User.countDocuments();
  if (existingUsers > 0) {
    console.log("Users already exist, skipping seed...");
    return;
  }

  const adminUser = await User.create({
    name: "Admin User",
    email: "admin@anarshop.com",
    password: "admin123",
    role: "admin",
  });

  const customerUser = await User.create({
    name: "Test Customer",
    email: "customer@test.com",
    password: "customer123",
    role: "customer",
  });

  console.log(`✓ Seeded 2 users (admin and customer)`);
};

const seedAbout = async () => {
  const existingAbout = await About.countDocuments();
  if (existingAbout > 0) {
    console.log("About content already exists, skipping seed...");
    return;
  }

  await About.create({});
  console.log(`✓ Seeded about page content`);
};

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log("Starting database seeding...\n");

    await seedCategories();
    await seedProducts();
    await seedUsers();
    await seedAbout();

    console.log("\n✓ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
