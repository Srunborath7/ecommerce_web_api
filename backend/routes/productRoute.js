const express = require('express');
const router = express.Router();
const db = require('../connection/connection');
const { saveData, deleteJsonById } = require('../stores/saveJson');
const checkUser = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

router.post('/products', checkUser, upload.single('img_pro'), (req, res) => {
  const { name, price, description, category_id, stock_quantity, created_by } = req.body;
  const img_pro = req.file ? req.file.filename : null;
  const creatorId = created_by || req.session?.user?.id || 1;

  if (!name || !price) {
    return res.status(400).json({ message: 'Name and price are required' });
  }

  const sql = `
    INSERT INTO products (name, price, description, category_id, img_pro, stock_quantity, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, price, description || null, category_id || null, img_pro, stock_quantity || 0, creatorId],
    (err, result) => {
      if (err) {
        console.error('Error inserting product:', err);
        return res.status(500).json({ message: 'DB error' });
      }

      const newProduct = {
        id: result.insertId,
        name,
        price,
        description: description || null,
        category_id: category_id || null,
        img_pro,
        stock_quantity: stock_quantity || 0,
        created_by: creatorId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Optional: save to file if needed
      saveData('../DB/db.json', newProduct, 'products');

      res.status(201).json({
        message: 'Product created',
        product: newProduct,
      });
    }
  );
});

router.put('/products/:id', checkUser, (req, res) => {
  const { id } = req.params;
  const { name, price, description, category_id, img_pro } = req.body;

  if (!name || !price) return res.status(400).json({ message: 'Name and price are required' });

  const sql = `
    UPDATE products
    SET name = ?, price = ?, description = ?, category_id = ?, img_pro = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  db.query(sql, [name, price, description || null, category_id || null, img_pro || null, id], (err, result) => {
    if (err) {
      console.error('Error updating product:', err);
      return res.status(500).json({ message: 'DB error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'product not found' });
    }
    const updatedProduct = {
      id: parseInt(id),
      name,
      price,
      description: description || null,
      category_id: category_id || null,
      img_pro: img_pro || null,
      updated_at: new Date().toISOString()
    };
    const { updateJsonById } = require('../stores/saveJson');
    updateJsonById('../DB/db.json', updatedProduct, 'products');

    res.status(200).json({ message: 'Product updated', product: updatedProduct });
  });
});

router.delete('/products/:id',checkUser, (req, res) => {
  const id = parseInt(req.params.id);

  db.query('DELETE FROM products WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json({ message: 'DB error' });
    }

    deleteJsonById('../DB/db.json', 'products', id);

    res.json({ message: 'Product deleted' });
  });
});

// 📦 Get All Products
router.get('/products', (req, res) => {
  const sql = `
    SELECT p.*, c.name AS category_name, u.username AS created_by_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN users u ON p.created_by = u.id
    ORDER BY p.created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ message: 'DB error' });
    }
    res.json(results);
  });
});
router.get('/products', (req, res) => {
  const { category, search } = req.query;

  let sql = `
    SELECT p.*, c.name AS category_name, u.username AS created_by_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN users u ON p.created_by = u.id
  `;

  const conditions = [];
  const values = [];

  if (category && category !== 'All') {
    conditions.push('c.name = ?');
    values.push(category);
  }

  if (search) {
    conditions.push('p.name LIKE ?');
    values.push(`%${search}%`);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' ORDER BY p.created_at DESC';

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ message: 'DB error' });
    }
    res.json(results);
  });
});
router.get('/products/:id', (req, res) => {
  const productId = req.params.id;

  const sql = `
    SELECT p.*, c.name AS category_name, u.username AS created_by_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN users u ON p.created_by = u.id
    WHERE p.id = ?
  `;

  db.query(sql, [productId], (err, results) => {
    if (err) {
      console.error('Error fetching product by ID:', err);
      return res.status(500).json({ message: 'DB error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(results[0]);
  });
});
module.exports = router;
