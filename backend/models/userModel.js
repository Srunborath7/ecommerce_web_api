const fs = require('fs');
const path = require('path');
const db = require('../connection/connection'); 
const bcrypt = require('bcrypt');

// Path to save JSON file
const jsonDir = path.join(__dirname, '../DB');
const jsonFile = path.join(jsonDir, 'db.json');

function roleUser() {
  return `
    CREATE TABLE IF NOT EXISTS roles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      role_name VARCHAR(50) NOT NULL UNIQUE
    );
  `;
}

function insertRoles() {
  return `
    INSERT INTO roles (role_name) VALUES
    ('admin'),
    ('manager'),
    ('user')
    ON DUPLICATE KEY UPDATE role_name = VALUES(role_name);
  `;
}

function tableUser() {
  return `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      role_id INT,
      FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
    );
  `;
}

function tableUserProfile() {
  return `
    CREATE TABLE IF NOT EXISTS user_profiles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      first_name VARCHAR(50),
      last_name VARCHAR(50),
      phone VARCHAR(20),
      address TEXT,
      profile_picture VARCHAR(255),
      bio TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;
}
function saveAllToJson() {
  // Ensure directory exists
  if (!fs.existsSync(jsonDir)) {
    fs.mkdirSync(jsonDir, { recursive: true });
  }

  db.query('SELECT * FROM users', (err1, users) => {
    if (err1) return console.error('Failed to fetch users:', err1);
    console.log(`Users fetched: ${users.length}`);

    db.query('SELECT * FROM roles', (err2, roles) => {
      if (err2) return console.error('Failed to fetch roles:', err2);
      console.log(`Roles fetched: ${roles.length}`);

      db.query('SELECT * FROM user_profiles', (err3, profiles) => {
        if (err3) return console.error('Failed to fetch profiles:', err3);
        console.log(`Profiles fetched: ${profiles.length}`);

        const data = {
          users,
          roles,
          profiles
        };

        try {
          fs.writeFileSync(jsonFile, JSON.stringify(data, null, 2), 'utf-8');
          console.log(`db.json saved successfully at ${jsonFile}`);
        } catch (writeErr) {
          console.error('Failed to write db.json:', writeErr);
        }
      });
    });
  });
}

async function createDefaultAdmin() {
  const username = 'admin';
  const email = 'admin@gmail.com';
  const plainPassword = '12345';
  const role_id = 1;

  // Check if admin already exists
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return console.error('Error checking admin:', err);
    if (results.length > 0) return console.log('Admin already exists');

    try {
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      const insertUserSql = 'INSERT INTO users (username, email, password, role_id) VALUES (?, ?, ?, ?)';
      db.query(insertUserSql, [username, email, hashedPassword, role_id], (err2, result) => {
        if (err2) return console.error('Failed to insert admin:', err2);

        const adminId = result.insertId;
        const insertProfileSql = 'INSERT INTO user_profiles (user_id) VALUES (?)';
        db.query(insertProfileSql, [adminId], (err3) => {
          if (err3) return console.error('Failed to insert admin profile:', err3);

          console.log('Default admin user and profile inserted');

          // Save current DB data to JSON
          saveAllToJson();
        });
      });
    } catch (hashErr) {
      console.error('Password hashing error:', hashErr);
    }
  });
}

// Run all migrations & create default admin
function runMigrationsAndSeed() {
  console.log('Running table migrations...');

  db.query(roleUser(), (err) => {
    console.log(err ? 'roles table error: ' + err : 'roles table OK');

    db.query(insertRoles(), (err2) => {
      console.log(err2 ? 'insert roles error: ' + err2 : 'default roles inserted');

      db.query(tableUser(), (err3) => {
        console.log(err3 ? 'users table error: ' + err3 : 'users table OK');

        db.query(tableUserProfile(), (err4) => {
          console.log(err4 ? 'user_profiles table error: ' + err4 : 'user_profiles table OK');

          // After tables created and roles inserted, create default admin
          createDefaultAdmin();
        });
      });
    });
  });
}
runMigrationsAndSeed();
module.exports = {
  roleUser,
  insertRoles,
  tableUser,
  tableUserProfile,
  createDefaultAdmin,
  saveAllToJson,
  runMigrationsAndSeed,
};
