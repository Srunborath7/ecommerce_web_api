const express = require('express');
const app = express();
const port = 5000;
require('./models/userModel');
app.use(express.json()); 
const session = require('express-session');
app.use(express.urlencoded({ extended: true })); 
const cors = require('cors');
app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true
  }
}));
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true              
}));

const user = require('./routes/userRoute');
const product = require('./routes/productRoute');
const category = require('./routes/categoryRoute');
const inventory = require('./routes/inventoryRoute');
require('./models/categoryModel').createCategoryTable();
require('./models/inventoryModel').createInventoryTable();
require('./models/productModel').createProductTable();
app.use('/api', user);
app.use('/api', category);
app.use('/api', product);
app.use('/api',inventory);
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});