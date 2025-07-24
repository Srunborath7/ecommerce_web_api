const express = require('express');
const router = express.Router();
const db = require('../connection/connection');
const { saveData, deleteJsonById } = require('../stores/saveJson');
const checkUser = require('../middleware/auth');
// ➕ Add inventory log (IN or OUT) & adjust product stock_quantity
router.get('/inventory', checkUser, (req, res) => {
  const sql = `
  SELECT
    inv.*,
    p.name AS product_name,
    p.price,
    p.img_pro,
    COALESCE(stock_calc.current_stock, 0) AS stock_quantity,
    u.username AS user
  FROM inventory inv
  LEFT JOIN products p ON inv.product_id = p.id
  LEFT JOIN users u ON inv.created_by = u.id
  LEFT JOIN (
    SELECT
      product_id,
      SUM(CASE WHEN action = 'IN' THEN quantity ELSE 0 END) -
      SUM(CASE WHEN action = 'OUT' THEN quantity ELSE 0 END) AS current_stock
    FROM inventory
    GROUP BY product_id
  ) AS stock_calc ON stock_calc.product_id = p.id
  ORDER BY inv.created_at DESC
`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Inventory fetch failed:', err);
      return res.status(500).json({ message: 'DB error' });
    }
    res.json(results);
  });
});
router.post('/inventory', checkUser, (req, res) => {
  const { product_id, quantity, action, description } = req.body;
  const created_by = req.session?.user?.id || null;

  if (!product_id || !quantity || !['IN', 'OUT'].includes(action)) {
    return res.status(400).json({ message: 'Invalid data' });
  }

  const insertSQL = `
    INSERT INTO inventory (product_id, quantity, action, description, created_by, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `;

  db.query(insertSQL, [product_id, quantity, action, description || null, created_by], (err, result) => {
    if (err) {
      console.error('Inventory insert error:', err);
      return res.status(500).json({ message: 'DB error' });
    }

    res.status(201).json({
      message: 'Inventory added',
      inventory_id: result.insertId,
    });
  });
});
router.put('/inventory/:id', (req, res) => {
  const { id } = req.params;
  const { product_id, quantity, action, description } = req.body;
  const userId = req.session?.user?.id || null; // or from JWT, etc.

  if (!product_id || !quantity || !action || !['IN', 'OUT'].includes(action)) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  // Validate quantity is positive integer
  const qty = parseInt(quantity);
  if (isNaN(qty) || qty <= 0) {
    return res.status(400).json({ message: 'Quantity must be positive integer' });
  }

  // Fetch the existing inventory entry to know the old quantity/action
  const getOldInvSql = `SELECT * FROM inventory WHERE id = ?`;
  db.query(getOldInvSql, [id], (err, oldInvRows) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (oldInvRows.length === 0) return res.status(404).json({ message: 'Inventory not found' });

    const oldInv = oldInvRows[0];

    // Fetch current stock from products
    const getProductSql = `SELECT * FROM products WHERE id = ?`;
    db.query(getProductSql, [product_id], (err, productRows) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err });
      if (productRows.length === 0) return res.status(404).json({ message: 'Product not found' });

      let currentStock = 0;
      const product = productRows[0];

      // Calculate current stock by summing all inventory IN and OUT for the product
      const stockSumSql = `
        SELECT 
          SUM(CASE WHEN action = 'IN' THEN quantity ELSE 0 END) AS total_in,
          SUM(CASE WHEN action = 'OUT' THEN quantity ELSE 0 END) AS total_out
        FROM inventory
        WHERE product_id = ?
      `;
      db.query(stockSumSql, [product_id], (err, sumRows) => {
        if (err) return res.status(500).json({ message: 'DB error', error: err });

        const totalIn = sumRows[0].total_in || 0;
        const totalOut = sumRows[0].total_out || 0;
        currentStock = totalIn - totalOut;

        // Adjust stock: Remove old inventory effect, add new inventory effect
        // stock after update = currentStock - oldEffect + newEffect
        const oldEffect = oldInv.action === 'IN' ? oldInv.quantity : -oldInv.quantity;
        const newEffect = action === 'IN' ? qty : -qty;
        const updatedStock = currentStock - oldEffect + newEffect;

        if (updatedStock < 0) {
          return res.status(400).json({ message: 'Stock cannot be negative' });
        }

        // Update inventory entry
        const updateInvSql = `
          UPDATE inventory
          SET product_id = ?, quantity = ?, action = ?, description = ?, created_by = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `;

        db.query(updateInvSql, [product_id, qty, action, description || null, userId, id], (err, result) => {
          if (err) return res.status(500).json({ message: 'DB error', error: err });

          res.json({ message: 'Inventory updated' });
        });
      });
    });
  });
});

// Delete inventory entry (optional)
router.delete('/inventory/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM inventory WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Inventory not found' });
    res.json({ message: 'Inventory deleted' });
  });
});


// 📦 Get all inventory logs
router.get('/inventory',checkUser, (req, res) => {
  const sql = `
    SELECT inv.*, p.name AS product_name, u.username AS user
    FROM inventory inv
    LEFT JOIN products p ON inv.product_id = p.id
    LEFT JOIN users u ON inv.created_by = u.id
    ORDER BY inv.created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Inventory fetch failed:', err);
      return res.status(500).json({ message: 'DB error' });
    }
    res.json(results);
  });
});

module.exports = router;
