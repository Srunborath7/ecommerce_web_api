import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/pages/Login';       // Adjust path if needed
import Register from './components/pages/Register'; // Adjust path if needed
import Dashboard from './components/pages/Dashboard'; // Adjust path if needed
import Products from './components/pages/Products';
import AddProduct from './components/pages/AddProduct';
import Category from './components/pages/Category';


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

      </Routes>
    </Router>
  );
}

export default App;
