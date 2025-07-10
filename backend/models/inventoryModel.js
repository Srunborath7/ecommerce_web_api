// inventoryModel.js
const db = require('../connection/connection');

function createInventoryTable() {
  return `
    CREATE TABLE IF NOT EXISTS inventory (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT,
      quantity INT NOT NULL,
      action ENUM('IN', 'OUT') NOT NULL,
      description TEXT,
      created_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
    );
  `;
}

db.query(createInventoryTable(), (err) => {
  if (err) console.error('Error creating inventory table:', err);
  else console.log('Inventory table ready');
});

module.exports = {
  createInventoryTable,
};
