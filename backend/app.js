const express = require('express');
const app = express();
const port = 5000;
require('./models/userModel');
app.use(express.json()); 
const session = require('express-session');
app.use(express.urlencoded({ extended: true })); 
const cors = require('cors');
const path = require('path');
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
const order = require('./routes/orderRoutes');
const payment = require('./routes/routePayment');   
require('./models/categoryModel').createCategoryTable();
require('./models/inventoryModel').createInventoryTable();
require('./models/productModel').createProductTable();
const { createOrdersTable, createOrderItemsTable } = require('./models/orderModel');
createOrdersTable();
createOrderItemsTable();
require('./models/paymentModel').createPaymentTable();

app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', user);
app.use('/api', category);
app.use('/api', product);
app.use('/api',inventory);
app.use('/api',order);
app.use('/api', payment); 
app.use("/invoices", express.static("invoices"));
app.use('/invoices', express.static(path.join(__dirname, 'invoices')));
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});