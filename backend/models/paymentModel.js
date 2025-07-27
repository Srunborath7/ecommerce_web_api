const db = require('../connection/connection');

function createPaymentTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS payments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      method VARCHAR(50),
      transaction_id VARCHAR(100),
      amount DECIMAL(10, 2),
      currency VARCHAR(10),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );
  `;

  db.query(sql, (err) => {
    if (err) {
      console.error('Error creating payments table:', err);
    } else {
      console.log('✅ Payments table created or already exists.');
    }
  });
}

module.exports = { createPaymentTable };
