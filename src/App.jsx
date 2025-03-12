import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './pages/login';
import Register from './pages/Register';
import Paiement from './pages/Paiement';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/paiement" element={<Paiement />} />
        <Route path="/profil" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
