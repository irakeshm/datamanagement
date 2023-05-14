import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/home"
          element={<Home isLoggedIn={isLoggedIn} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
