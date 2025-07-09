// routes/categoryRoute.js
const express = require('express');
const router = express.Router();
const db = require('../connection/connection');
const { saveData } = require('../stores/saveJson');

router.post('/categories', (req, res) => {
  const { name, description } = req.body;
  const created_by = req.session?.user?.id;

  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  if (!created_by) {
    return res.status(401).json({ message: 'Unauthorized. User ID missing in session.' });
  }

  const sql = `INSERT INTO categories (name, description, created_by) VALUES (?, ?, ?)`;

  db.query(sql, [name, description, created_by], (err, result) => {
    if (err) {
      console.error('❌ Failed to insert category:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    const category = {
      id: result.insertId,
      name,
      description,
      created_by,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Save to db.json under "categories"
    saveData('../DB/db.json', category, 'categories');

    res.status(201).json({ message: 'Category created', category });
  });
});

module.exports = router;
