import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/admin/Login';
import Register from './components/admin/Register';
import Dashboard from './components/admin/Dashboard';
import Products from './components/admin/Products';
import AddProduct from './components/admin/AddProduct';
import Category from './components/admin/Category';
import Ecommerce from './components/pages/ecommerce';
import Checkout from './components/pages/Checkout';
import { CartProvider } from './components/layout/CartContext';  // Import your cart context

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<h2>Dashboard Work</h2>} />
            <Route path="products" element={<Products />} />
            <Route path="add" element={<AddProduct />} />
            <Route path="category" element={<Category />} />
          </Route>

          <Route path="/ecommerce" element={<Ecommerce />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
