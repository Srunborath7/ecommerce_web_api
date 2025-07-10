// productModel.js
const db = require('../connection/connection');

function createProductTable() {
  return `
    CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    stock_quantity INT DEFAULT 0,
    category_id INT,
    created_by INT,
    img_pro VARCHAR(255),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;
}

db.query(createProductTable(), (err) => {
  if (err) console.error('Error creating products table:', err);
  else console.log('Products table ready');
});

module.exports = {
  createProductTable,
};
