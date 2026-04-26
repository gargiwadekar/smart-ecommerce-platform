const express = require("express");
const router = express.Router();

let Razorpay;
try {
  Razorpay = require("razorpay");
} catch (e) {
  console.warn("⚠️ Razorpay package not available. Payment routes will return disabled status.");
}

function validateRazorpayConfig() {
  const id = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!id || !secret) return { ok: false, reason: "missing" };
  if (!id.startsWith("rzp_test_")) return { ok: false, reason: "live_keys" };
  return { ok: true };
}

router.post("/order", async (req, res) => {
  const cfg = validateRazorpayConfig();
  if (!cfg.ok) {
    if (cfg.reason === "missing") {
      return res.status(503).json({ message: "Payment service not configured" });
    }
    if (cfg.reason === "live_keys") {
      console.warn("⚠️ Razorpay configured with live keys. Rejecting payments to keep test-only mode.");
      return res.status(503).json({ message: "Payment service not configured for test mode" });
    }
  }

  if (!Razorpay) {
    return res.status(503).json({ message: "Payment service not available" });
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    const { amount } = req.body || {};
    if (!amount || typeof amount !== "number") {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
    });

    res.json(order);
  } catch (err) {
    console.error("❌ [PAYMENT] Order creation failed:", err && err.message ? err.message : err);
    res.status(500).json({ message: "Payment order creation failed", error: err && err.message ? err.message : String(err) });
  }
});

module.exports = router;