const express = require("express");
const router = express.Router();
const db = require("../connection/connection"); // your mysql connection
const checkUser = require("../middleware/auth"); // optional middleware to get user from session

// POST /api/contact
router.post("/contact", checkUser, (req, res) => {
  const { name, email, message } = req.body;
  const created_by = req.session?.user?.id; 
  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const insertSQL = `
    INSERT INTO contacts (name, email, message, created_by)
    VALUES (?, ?, ?, ?)
  `;

  db.query(insertSQL, [name, email, message, created_by], (err, result) => {
    if (err) {
      console.error("Failed to save contact message:", err);
      return res.status(500).json({ message: "Failed to save message." });
    }

    res.status(201).json({ message: "Message sent successfully!" });
  });
});
router.get("/contact", checkUser, (req, res) => {
  const sql = `SELECT id, name, email, message, created_by, created_at FROM contacts ORDER BY created_at DESC`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Failed to fetch contacts:", err);
      return res.status(500).json({ message: "Failed to fetch contacts" });
    }
    res.json(results);
  });
});
module.exports = router;
