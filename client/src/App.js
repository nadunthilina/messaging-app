import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import Settings from './components/Settings';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState('');

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Chat
                  user={user}
                  setUser={setUser}
                  profilePhoto={profilePhoto}
                  setProfilePhoto={setProfilePhoto}
                />
              ) : (
                <Login setUser={setUser} setProfilePhoto={setProfilePhoto} />
              )
            }
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/settings"
            element={
              user ? (
                <Settings
                  user={user}
                  profilePhoto={profilePhoto}
                  setProfilePhoto={setProfilePhoto}
                />
              ) : (
                <Login setUser={setUser} setProfilePhoto={setProfilePhoto} />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;