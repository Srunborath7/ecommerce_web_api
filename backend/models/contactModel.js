const db = require('../connection/connection');

function createContactTable() {
  return `
    CREATE TABLE IF NOT EXISTS contacts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      message TEXT NOT NULL,
      created_by INT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
    );
  `;
}
db.query(createContactTable(), (err) => {
  if (err) console.error('Error creating contacts table:', err);
  else console.log('Contacts table ready');
});
module.exports = {
  createContactTable,
};