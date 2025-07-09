const express = require('express');
const product = express.Router();
const db = require('../connection/connection');
const checkUser = require('../middleware/auth');

product.get('/products', checkUser, (req, res) => {
  res.status(200).json({
    message: 'Products fetched successfully',
    products: [
      { id: 1, name: 'Product 1', price: 100 },
      { id: 2, name: 'Product 2', price: 200 }
    ]
  });
});


module.exports = product;