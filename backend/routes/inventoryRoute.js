const express = require('express');
const router = express.Router();
const db = require('../connection/connection');
const { saveData, updateJsonById, deleteJsonById } = require('../stores/saveJson');

// ➕ Add inventory log (IN or OUT) & adjust product stock_quantity
router.post('/inventory', (req, res) => {
  const { product_id, quantity, action, description } = req.body;
  const created_by = req.session?.user?.id || null;

  if (!product_id || !quantity || !['IN', 'OUT'].includes(action)) {
    return res.status(400).json({ message: 'Invalid data' });
  }

  const insertSQL = `
    INSERT INTO inventory (product_id, quantity, action, description, created_by)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(insertSQL, [product_id, quantity, action, description || null, created_by], (err, result) => {
    if (err) {
      console.error('❌ Inventory insert error:', err);
      return res.status(500).json({ message: 'DB error' });
    }

    // Update stock_quantity in products table
    const stockSQL = `
      UPDATE products SET stock_quantity = stock_quantity ${action === 'IN' ? '+' : '-'} ?
      WHERE id = ?
    `;
    db.query(stockSQL, [quantity, product_id]);

    const inventory = {
      id: result.insertId,
      product_id,
      quantity,
      action,
      description,
      created_by,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    saveData('../DB/db.json', inventory, 'inventory');

    res.status(201).json({ message: 'Inventory logged', inventory });
  });
});

// 📝 Update inventory log
router.put('/inventory/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { quantity, description } = req.body;

  const sql = `
    UPDATE inventory SET quantity = ?, description = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  db.query(sql, [quantity, description || null, id], (err) => {
    if (err) {
      console.error('❌ Update failed:', err);
      return res.status(500).json({ message: 'DB error' });
    }

    updateJsonById('../DB/db.json', 'inventory', id, {
      quantity,
      description,
      updated_at: new Date().toISOString()
    });

    res.json({ message: 'Inventory updated' });
  });
});

// ❌ Delete inventory log and reverse stock
router.delete('/inventory/:id', (req, res) => {
  const id = parseInt(req.params.id);

  db.query('SELECT * FROM inventory WHERE id = ?', [id], (err, rows) => {
    if (err || rows.length === 0) {
      return res.status(404).json({ message: 'Inventory not found' });
    }

    const record = rows[0];

    // Reverse stock change
    const reverseSQL = `
      UPDATE products SET stock_quantity = stock_quantity ${record.action === 'IN' ? '-' : '+'} ?
      WHERE id = ?
    `;
    db.query(reverseSQL, [record.quantity, record.product_id]);

    // Delete log
    db.query('DELETE FROM inventory WHERE id = ?', [id], (err2) => {
      if (err2) {
        console.error('❌ Delete failed:', err2);
        return res.status(500).json({ message: 'DB error' });
      }

      deleteJsonById('DB/db.json', 'inventory', id);
      res.json({ message: 'Inventory deleted and stock reversed' });
    });
  });
});

// 📦 Get all inventory logs
router.get('/inventory', (req, res) => {
  const sql = `
    SELECT inv.*, p.name AS product_name, u.username AS user
    FROM inventory inv
    LEFT JOIN products p ON inv.product_id = p.id
    LEFT JOIN users u ON inv.created_by = u.id
    ORDER BY inv.created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Inventory fetch failed:', err);
      return res.status(500).json({ message: 'DB error' });
    }
    res.json(results);
  });
});

module.exports = router;
