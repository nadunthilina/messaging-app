import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <div>
      {user ? (
        <Chat user={user} />
      ) : (
        <div>
          <Login setUser={setUser} />
          <Register />
        </div>
      )}
    </div>
  );
};

export default App;