import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import Whiteboard from './pages/Whiteboard';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="bottom-right" />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/board/:id" element={<Whiteboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
