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
function saveAllToJson() {
  let users = [], roles = [], profiles = [], categories = [];

  db.query('SELECT * FROM users', (e1, r1) => {
    if (!e1) users = r1;

    db.query('SELECT * FROM roles', (e2, r2) => {
      if (!e2) roles = r2;

      db.query('SELECT * FROM user_profiles', (e3, r3) => {
        if (!e3) profiles = r3;

        db.query('SELECT * FROM categories', (e4, r4) => {
          if (!e4) categories = r4;

          const backup = {
            users,
            role: roles,
            profile: profiles,
            categories
          };

          const filePath = path.join(__dirname, '../DB/db.json');
          fs.writeFileSync(filePath, JSON.stringify(backup, null, 2), 'utf-8');
          console.log('📁 db.json saved successfully');
        });
      });
    });
  });
}

module.exports = { saveData,saveAllToJson };
