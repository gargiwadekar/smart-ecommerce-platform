const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// ✅ ROUTES
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const productRoutes = require("./routes/productRoutes");

// ✅ MODEL (IMPORTANT for test insert)
const User = require("./models/User");
const Product = require("./models/Product");

const app = express();

/* ================= MIDDLEWARE ================= */
// ✅ CORS configuration - allow deployed frontend via CLIENT_URL env
const CLIENT_URL = process.env.CLIENT_URL;
if (CLIENT_URL) {
  app.use(cors({ origin: CLIENT_URL, credentials: true }));
} else {
  app.use(cors());
  console.warn("⚠️ CLIENT_URL not set. CORS is permissive for development. Set CLIENT_URL in production.");
}
app.use(express.json());

/* ================= MONGODB CONNECTION ================= */
if (!process.env.MONGO_URI) {
  console.log("❌ MONGO_URI missing in .env");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.log("❌ MongoDB Error:", err.message);
    process.exit(1);
  });

// Optional services warnings (do not crash the app)
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn("⚠️ RAZORPAY keys not configured. Payment endpoint will return 'Payment service not configured'.");
} else if (!process.env.RAZORPAY_KEY_ID.startsWith("rzp_test_")) {
  console.warn("⚠️ RAZORPAY key appears to be live. App enforces test-mode only. Payments will be disabled.");
}

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn("⚠️ EMAIL credentials not configured. Email/OTP features will fallback to server logging.");
}

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/products", productRoutes);

/* ================= DEV/TEST ROUTES REMOVED ================= */
// Removed unsafe test routes from production build: create-test, cleanup-products, verify-products

/* ================= ROOT ================= */
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

/* ================= ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack || err);
  res.status(err.status || 500).json({ message: err.message || "Something went wrong" });
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});