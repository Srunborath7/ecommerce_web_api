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
  const {
    name,
    price,
    description,
    category_id,
    created_by,
    initial_quantity,  // expect this from client
  } = req.body;

  const img_pro = req.file ? req.file.filename : null;
  const creatorId = created_by || req.session?.user?.id || 1;
  const initQty = parseInt(initial_quantity) || 0;

  if (!name || !price) {
    return res.status(400).json({ message: 'Name and price are required' });
  }

  // Insert product (without stock_quantity column)
  const sqlProduct = `
    INSERT INTO products (name, price, description, category_id, img_pro, created_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sqlProduct,
    [name, price, description || null, category_id || null, img_pro, creatorId],
    (err, result) => {
      if (err) {
        console.error('Error inserting product:', err);
        return res.status(500).json({ message: 'DB error' });
      }

      const productId = result.insertId;

      // If initial quantity > 0, insert inventory record
      if (initQty > 0) {
        const sqlInventory = `
          INSERT INTO inventory (product_id, quantity, action, description, created_by)
          VALUES (?, ?, 'IN', 'Initial stock', ?)
        `;
        db.query(sqlInventory, [productId, initQty, creatorId], (invErr) => {
          if (invErr) {
            console.error('Error inserting initial inventory:', invErr);
            // You might want to rollback product insert or handle this error as needed
          }
          // Respond success after inventory insert or even if inventory insert fails
          res.status(201).json({
            message: 'Product created and inventory updated',
            product: {
              id: productId,
              name,
              price,
              description,
              category_id,
              img_pro,
              created_by: creatorId,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            initial_quantity: initQty,
          });
        });
      } else {
        // No initial quantity to add, just respond success
        res.status(201).json({
          message: 'Product created',
          product: {
            id: productId,
            name,
            price,
            description,
            category_id,
            img_pro,
            created_by: creatorId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          initial_quantity: 0,
        });
      }
    }
  );
});
router.put('/products/:id', upload.single('img_pro'), checkUser, (req, res) => {
  const { id } = req.params;
  const { name, price, description, category_id, img_pro: oldImgPro } = req.body;

  // Validate required fields
  if (!name || !price) {
    return res.status(400).json({ message: 'Name and price are required' });
  }

  // Use new uploaded file if exists, otherwise fallback to old image filename or null
  const img_pro = req.file ? req.file.filename : (oldImgPro || null);

  const sql = `
    UPDATE products
    SET name = ?, price = ?, description = ?, category_id = ?, img_pro = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.query(
    sql,
    [name, price, description || null, category_id || null, img_pro, id],
    (err, result) => {
      if (err) {
        console.error('Error updating product:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Build updated product object to return in response
      const updatedProduct = {
        id: parseInt(id),
        name,
        price,
        description: description || null,
        category_id: category_id || null,
        img_pro,
        updated_at: new Date().toISOString(),
      };

      // Update product in JSON storage if you are maintaining a JSON file as well
      const { updateJsonById } = require('../stores/saveJson');
      updateJsonById('../DB/db.json', updatedProduct, 'products');

      res.status(200).json({ message: 'Product updated', product: updatedProduct });
    }
  );
});

router.delete('/products/:id', checkUser, (req, res) => {
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