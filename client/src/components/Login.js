import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ setUser, setProfilePhoto }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      setUser(response.data.username);
      setProfilePhoto(response.data.profilePhoto || '');
      setMessage('Login successful!');
      setMessageType('success');
      navigate('/');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
      setMessageType('danger');
    }
  };

  return (
    <Card style={{ width: '400px', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <Card.Body>
        <Card.Title className="text-center mb-4">Login to Chat</Card.Title>
        {message && <Alert variant={messageType}>{message}</Alert>}
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mb-3">
            Login
          </Button>
          <div className="text-center">
            <span>Don't have an account? </span>
            <Link to="/register">Register</Link>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Login;