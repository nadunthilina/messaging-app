import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Form, Button, Card, ListGroup, InputGroup, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:5000');

const Chat = ({ user, setUser, profilePhoto }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/messages/${user}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();

    socket.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => socket.off('message');
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() && recipient.trim()) {
      const newMessage = { sender: user, recipient, content: message };
      try {
        await axios.post('http://localhost:5000/api/messages', newMessage);
        socket.emit('sendMessage', newMessage);
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <Card style={{ width: '600px', height: '80vh', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center">
            {profilePhoto ? (
              <Image src={profilePhoto} roundedCircle width="40" height="40" className="me-2" />
            ) : (
              <div className="bg-secondary rounded-circle me-2" style={{ width: '40px', height: '40px' }}></div>
            )}
            <Card.Title>Chat as {user}</Card.Title>
          </div>
          <div>
            <Button variant="outline-primary" className="me-2" onClick={() => navigate('/settings')}>
              Settings
            </Button>
            <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
        <ListGroup variant="flush" style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
          {messages.map((msg, index) => (
            <ListGroup.Item
              key={index}
              className={msg.sender === user ? 'text-end bg-light' : 'text-start'}
              style={{ borderRadius: '10px', margin: '5px 0' }}
            >
              <strong>{msg.sender}:</strong> {msg.content}
            </ListGroup.Item>
          ))}
          <div ref={messagesEndRef} />
        </ListGroup>
        <Form onSubmit={sendMessage}>
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              placeholder="Recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
            />
            <Form.Control
              type="text"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <Button variant="primary" type="submit">Send</Button>
          </InputGroup>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Chat;