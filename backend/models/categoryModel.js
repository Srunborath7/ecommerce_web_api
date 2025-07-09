const db = require('../connection/connection');
const { saveAllToJson } = require('../stores/saveJson');

function tableCategory() {
  return `
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      description TEXT,
      created_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB;
  `;
}

function createCategoryTable() {
  db.query(tableCategory(), (err) => {
    if (err) {
      console.error('❌ Error creating categories table:', err);
    } else {
      console.log('✅ Categories table created');
      saveAllToJson(); // optional: backup after table is ensured
    }
  });
}

module.exports = {
  tableCategory,
  createCategoryTable
};