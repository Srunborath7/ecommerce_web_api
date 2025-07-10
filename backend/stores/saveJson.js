const fs = require('fs');
const path = require('path');
const db = require('../connection/connection');
function saveData(fileName, newData, key) {
  const filePath = path.join(__dirname, fileName);

  let existingData = {};
  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      existingData = JSON.parse(raw || '{}');
    } catch (err) {
      console.error('Error reading JSON:', err);
    }
  }

  if (!existingData[key]) {
    existingData[key] = [];
  }

  // Avoid duplicates by ID
  const exists = existingData[key].some((item) => item.id === newData.id);
  if (!exists) {
    existingData[key].push(newData);
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), 'utf-8');
    console.log(`${key} saved to ${fileName}`);
  }
}
function updateJsonById(fileName, updatedData, key) {
  const filePath = path.join(__dirname, '../DB/' + fileName);

  let existing = {};
  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      existing = JSON.parse(raw || '{}');
    } catch (e) {
      console.error('Error parsing JSON:', e);
    }
  }

  if (!Array.isArray(existing[key])) {
    existing[key] = [];
  }

  const index = existing[key].findIndex(item => item.id === updatedData.id);
  if (index !== -1) {
    existing[key][index] = { ...existing[key][index], ...updatedData };
  } else {
    existing[key].push(updatedData);
  }

  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), 'utf-8');
  console.log(`✅ ${key} with ID ${updatedData.id} updated in ${fileName}`);
}

function saveAllToJson() {
  let users = [], roles = [], profiles = [], categories = [], products = [], inventory = [];

  db.query('SELECT * FROM users', (e1, r1) => {
    if (!e1) users = r1;

    db.query('SELECT * FROM roles', (e2, r2) => {
      if (!e2) roles = r2;

      db.query('SELECT * FROM user_profiles', (e3, r3) => {
        if (!e3) profiles = r3;

        db.query('SELECT * FROM categories', (e4, r4) => {
          if (!e4) categories = r4;

          db.query('SELECT * FROM products', (e5, r5) => {
            if (!e5) products = r5;

            db.query('SELECT * FROM inventory', (e6, r6) => {
              if (!e6) inventory = r6;

              const backup = {
                users,
                role: roles,
                profile: profiles,
                categories,
                products,
                inventory
              };

              const filePath = path.join(__dirname, '../DB/db.json');
              fs.writeFileSync(filePath, JSON.stringify(backup, null, 2), 'utf-8');
              console.log('📦 db.json saved with inventory');
            });
          });
        });
      });
    });
  });
}

function deleteJsonById(fileName, idToDelete, key) {
  const filePath = path.join(__dirname, '../DB/' + fileName);

  let existing = {};
  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      existing = JSON.parse(raw || '{}');
    } catch (e) {
      console.error('Error reading JSON:', e);
    }
  }

  if (!Array.isArray(existing[key])) return;

  existing[key] = existing[key].filter(item => item.id !== idToDelete);

  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), 'utf-8');
  console.log(`🗑️ Deleted ${key} ID ${idToDelete} from ${fileName}`);
}

module.exports = { saveData, saveAllToJson, updateJsonById, deleteJsonById };

