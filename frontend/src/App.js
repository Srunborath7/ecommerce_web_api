import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/admin/Login';       // Adjust path if needed
import Register from './components/admin/Register'; // Adjust path if needed
import Dashboard from './components/admin/Dashboard'; // Adjust path if needed
import Products from './components/admin/Products';
import AddProduct from './components/admin/AddProduct';
import Category from './components/admin/Category';
import Ecommerce from './components/pages/ecommerce';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}

        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<h2>Dashboard Work</h2>} />
          <Route path="products" element={<Products />} />
          <Route path="add" element={<AddProduct />} />
          <Route path="category" element={<Category />} />
        </Route>
        <Route path="/ecommerce" element={<Ecommerce/>} />

      </Routes>
    </Router>
  );
}

export default App;
