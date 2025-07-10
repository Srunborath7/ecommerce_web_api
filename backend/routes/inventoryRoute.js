const express = require('express');
const router = express.Router();
const db = require('../connection/connection');
const { saveData, deleteJsonById } = require('../stores/saveJson');
const checkUser = require('../middleware/auth');
// ➕ Add inventory log (IN or OUT) & adjust product stock_quantity
router.post('/inventory',checkUser, (req, res) => {
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
      console.error('Inventory insert error:', err);
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

router.put('/inventory/:id', (req, res) => {
  const { id } = req.params;
  const { quantity, description, action, product_id } = req.body;

  if (!action || !['IN', 'OUT'].includes(action)) {
    return res.status(400).json({ message: 'Invalid or missing action type' });
  }

  const sql = `
    UPDATE inventory 
    SET quantity = ?, description = ?, action = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.query(sql, [quantity, description || null, action, id], (err, result) => {
    if (err) {
      console.error('Update failed:', err);
      return res.status(500).json({ message: 'DB error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Inventory not found' });
    }

    const stockSQL = `
      UPDATE products SET stock_quantity = stock_quantity ${action === 'IN' ? '+' : '-'} ?
      WHERE id = ?
    `;

    db.query(stockSQL, [quantity, product_id], (err2, result2) => {
      if (err2) {
        console.error('Failed to update stock_quantity:', err2);
        return res.status(500).json({ message: 'Stock update error' });
      }
      if (result2.affectedRows === 0) {
        return res.status(404).json({ message: 'Product not found' });   
      }
      const updateInventory = {
        id: parseInt(id),
        quantity,
        description,
        action,
        product_id,
        updated_at: new Date().toISOString()
      };
      const { updateJsonById } = require('../stores/saveJson');
      updateJsonById('../DB/db.json', 'inventory', parseInt(id), updateInventory);
      db.query(`SELECT stock_quantity FROM products WHERE id = ?`, [product_id], (err3, productRows) => {
        if (!err3 && productRows.length > 0) {
          const updatedProduct = {
            stock_quantity: productRows[0].stock_quantity,
            updated_at: new Date().toISOString()
          };
          const { updateJsonById } = require('../stores/saveJson')
          updateJsonById('../DB/db.json', 'products', parseInt(product_id), updatedProduct);
        }

        res.status(200).json({
          message: 'Inventory and product stock updated',
          inventory: updateInventory
        });
      });
    });
  });
});

router.delete('/inventory/:id',checkUser, (req, res) => {
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
        console.error('Delete failed:', err2);
        return res.status(500).json({ message: 'DB error' });
      }

      deleteJsonById('DB/db.json', 'inventory', id);
      res.json({ message: 'Inventory deleted and stock reversed' });
    });
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
