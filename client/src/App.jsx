import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          {/* <Route path="products" element={<ProductList />} /> */}
          {/* <Route path="products/:id" element={<ProductDetail />} /> */}
          {/* <Route path="cart" element={<Cart />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
