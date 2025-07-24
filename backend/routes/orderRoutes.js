const express = require("express");
const router = express.Router();
const db = require("../connection/connection");
const checkUser = require('../middleware/auth')
// POST /checkout - place an order
router.post("/checkout", (req, res) => {
  const userId = req.session.user.id;
  const { cartItems } = req.body;

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ message: "Invalid input data: empty cart" });
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const insertOrderSQL = "INSERT INTO orders (user_id, total_price) VALUES (?, ?)";
  db.query(insertOrderSQL, [userId, totalPrice], (err, orderResult) => {
    if (err) {
      console.error("Failed to create order:", err);
      return res.status(500).json({ message: "Order creation failed" });
    }

    const orderId = orderResult.insertId;

    const orderItemsSQL = "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?";
    const orderItemsValues = cartItems.map(item => [orderId, item.id, item.quantity, item.price]);

    db.query(orderItemsSQL, [orderItemsValues], (err) => {
      if (err) {
        console.error("Failed to insert order items:", err);
        return res.status(500).json({ message: "Order items creation failed" });
      }

      res.status(201).json({
        message: "Order placed successfully",
        orderId,
        total: totalPrice,
      });
    });
  });
});

// List all orders
router.get("/orders", (req, res) => {
  const sql = `
    SELECT o.*, u.username
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      return res.status(500).json({ message: "Failed to get orders" });
    }
    res.json(results);
  });
});

const crc16 = require("crc").crc16;
const qrcode = require("qrcode");
// Safe TLV formatter
function formatTLV(tag, value) {
  if (typeof value !== "string") value = String(value || "");
  const length = value.length.toString().padStart(2, "0");
  return tag + length + value;
}

// KHQR generator with safe defaults
function generateKHQR(storeName, merchantId, amount, currency = "116") {
  storeName = storeName ? String(storeName) : "Store";
  merchantId = merchantId ? String(merchantId) : "0000000000";
  amount = amount ? Number(amount) : 0;

  let khqr = formatTLV("00", "01"); // Payload Format Indicator
  khqr += formatTLV("01", amount ? "12" : "11"); // Point of Initiation Method

  // Merchant Account Info - Tag 29
  const guid = formatTLV("00", "A000000677010111");
  const account = formatTLV("01", merchantId);
  khqr += formatTLV("29", guid + account);

  khqr += formatTLV("52", "0000"); // MCC
  khqr += formatTLV("53", currency);

  if (amount) {
    khqr += formatTLV("54", amount.toFixed(2));
  }

  khqr += formatTLV("58", "KH"); // Country Code
  khqr += formatTLV("59", storeName.slice(0, 25));
  khqr += formatTLV("60", "Phnom Penh");

  const crcString = khqr + "6304";

  const buffer = Buffer.from(crcString, "utf8");
  const checksum = crc16(buffer)
    .toString(16)
    .toUpperCase()
    .padStart(4, "0");

  return crcString + checksum;
}

// Route to get order info + items
router.get("/orders/:orderId", (req, res) => {
  const orderId = req.params.orderId;

  const orderSQL = "SELECT * FROM orders WHERE id = ?";
  const itemsSQL = `
    SELECT oi.*, p.name, p.img_pro
    FROM order_items oi
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
  `;

  db.query(orderSQL, [orderId], (err, orderResult) => {
    if (err || orderResult.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    db.query(itemsSQL, [orderId], (err, itemsResult) => {
      if (err) {
        console.error("Failed to fetch order items:", err);
        return res.status(500).json({ message: "Failed to get order items" });
      }

      res.json({
        order: orderResult[0],
        items: itemsResult,
      });
    });
  });
});

// Route to generate and return KHQR QR code PNG dynamically
router.get("/payments/:orderId/qr/:payway", (req, res) => {
  const { orderId, payway } = req.params;

  const orderSQL = "SELECT * FROM orders WHERE id = ?";
  db.query(orderSQL, [orderId], async (err, orderResult) => {
    if (err || orderResult.length === 0) {
      return res.status(404).send("Order not found");
    }
    const order = orderResult[0];

    // Map payway to merchant ID column (adjust to your DB fields)
    let merchantId;
    switch (payway) {
      case "aba":
        merchantId = order.merchant_id_aba;
        break;
      case "acleda":
        merchantId = order.merchant_id_acleda;
        break;
      case "wing":
        merchantId = order.merchant_id_wing;
        break;
      default:
        return res.status(400).send("Unsupported payway");
    }

    // Provide defaults if any field missing
    const storeName = order.store_name || "My Store";
    const amount = order.total_price || 0;

    const khqrString = generateKHQR(storeName, merchantId, amount);

    try {
      const qrBuffer = await qrcode.toBuffer(khqrString, { type: "png" });
      res.set("Content-Type", "image/png");
      res.send(qrBuffer);
    } catch (err) {
      console.error("Failed to generate QR code:", err);
      res.status(500).send("Failed to generate QR code");
    }
  });
});


module.exports = router;
