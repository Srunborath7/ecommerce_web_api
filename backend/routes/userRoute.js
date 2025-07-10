const express = require('express');
const user = express.Router();
const db = require('../connection/connection');
const bcrypt = require('bcrypt');
const { saveData } = require('../stores/saveJson');

user.post('/login', (req, res) => {
  const { emailOrUsername, password } = req.body;
  if (!emailOrUsername || !password) {
    return res.status(400).json({ message: 'Email/Username and password are required' });
  }
  const sql = `
    SELECT users.*, roles.role_name 
    FROM users 
    LEFT JOIN roles ON users.role_id = roles.id 
    WHERE users.email = ? OR users.username = ?
  `;

  db.query(sql, [emailOrUsername, emailOrUsername], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = results[0];
    const storedPassword = user.password;

    let match = false;

    try {
      match = await bcrypt.compare(password, storedPassword);
    } catch {
      match = false;
    }

    if (!match && storedPassword === password) {
      const hashed = await bcrypt.hash(password, 10);
      db.query(`UPDATE users SET password = ? WHERE id = ?`, [hashed, user.id], (err2) => {
        if (err2) console.error('Failed to hash password:', err2);
      });
      match = true;
    }

    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role_name,
      role_id: user.role_id
    };

    res.status(200).json({
      message: 'Login successful',
      user: req.session.user
    });
  });
});

user.post('/register', async (req, res) => {
  const { username, password, email, role_id: requestedRoleId } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Username, password, and email are required' });
  }
  const currentUserRole = req.session?.user?.role || 'user';
  const role = typeof currentUserRole === 'string' ? currentUserRole.toLowerCase() : 'user';

  const role_id = (role !== 'admin' && role !== 'manager') ? 3 : requestedRoleId;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertUserSQL = `INSERT INTO users (username, password, email, role_id) VALUES (?, ?, ?, ?)`;

    db.query(insertUserSQL, [username, hashedPassword, email, role_id], (err, result) => {
      if (err) {
        console.error('User insert error:', err);
        return res.status(500).json({ message: 'Registration failed' });
      }

      const userId = result.insertId;

      db.query(`INSERT INTO user_profiles (user_id) VALUES (?)`, [userId], (err2) => {
        if (err2) {
          console.error('Profile insert error:', err2);
          return res.status(500).json({ message: 'Profile creation failed' });
        }

        // Fetch the full user record including role_id
        db.query(`SELECT * FROM users WHERE id = ?`, [userId], (err3, userRows) => {
          if (err3) {
            console.error('Fetch user error:', err3);
            return res.status(500).json({ message: 'Error retrieving user' });
          }

          const fullUser = userRows[0];

          // Fetch user profile record
          db.query(`SELECT * FROM user_profiles WHERE user_id = ?`, [userId], (err4, profileRows) => {
            if (err4) {
              console.error('Fetch profile error:', err4);
              return res.status(500).json({ message: 'Error retrieving profile' });
            }

            const profile = profileRows[0];

            saveData('../DB/db.json', fullUser, 'users');
            saveData('../DB/db.json', profile, 'profiles'); 

            const sessionUser = {
              id: fullUser.id,
              username: fullUser.username,
              email: fullUser.email,
              role: fullUser.role_id,
            };

            req.session.user = sessionUser;

            return res.status(201).json({
              message: 'Registration successful',
              user: sessionUser,
            });
          });
        });
      });
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = user;
