import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={user ? <Chat user={user} setUser={setUser} /> : <Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;