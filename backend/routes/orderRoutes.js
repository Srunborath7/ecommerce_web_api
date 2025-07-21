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

// Get single order details by ID
router.get("/orders/:orderId", checkUser, (req, res) => {
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


module.exports = router;
