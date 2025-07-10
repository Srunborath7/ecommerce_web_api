// routes/categoryRoute.js
const express = require('express');
const router = express.Router();
const db = require('../connection/connection');
const { saveData } = require('../stores/saveJson');
const checkUser = require('../middleware/auth');
router.post('/categories',checkUser, (req, res) => {
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
      console.error('Failed to insert category:', err);
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
router.put('/categories/:id',checkUser, (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  const sql = `UPDATE categories SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

  db.query(sql, [name, description, id], (err, result) => {
    if (err) {
      console.error('Failed to update category:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Updated successfully
    const updatedCategory = {
      id: parseInt(id),
      name,
      description,
      updated_at: new Date().toISOString()
    };

    // 🔄 Update the JSON file (overwrite category by ID)
    const { updateJsonById } = require('../stores/saveJson');
    updateJsonById('../DB/db.json', updatedCategory, 'categories');

    res.status(200).json({ message: 'Category updated', category: updatedCategory });
  });
});
router.delete('/categories/:id',checkUser, (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM categories WHERE id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Failed to delete category:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Remove from JSON
    const { deleteJsonById } = require('../stores/saveJson');
    deleteJsonById('db.json', parseInt(id), 'categories');

    res.status(200).json({ message: 'Category deleted' });
  });
});
module.exports = router;
