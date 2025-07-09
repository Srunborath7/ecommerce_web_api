const fs = require('fs');
const path = require('path');

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
  db.query('SELECT * FROM users', (err1, users) => {
    if (err1) return console.error('Failed to fetch users:', err1);
    console.log('Users fetched:', users.length);

    db.query('SELECT * FROM roles', (err2, roles) => {
      if (err2) return console.error('Failed to fetch roles:', err2);
      console.log('Roles fetched:', roles.length);

      db.query('SELECT * FROM user_profiles', (err3, profiles) => {
        if (err3) return console.error('Failed to fetch profiles:', err3);
        console.log('Profiles fetched:', profiles.length);

        const data = {
          users,
          roles,    
          profiles
        };

        const filePath = path.join(__dirname, '../DB/db.json');
        try {
          fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
          console.log('db.json saved successfully');
        } catch (writeErr) {
          console.error('Failed to write db.json:', writeErr);
        }
      });
    });
  });
}

module.exports = { saveData,saveAllToJson };
