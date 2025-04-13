import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Form, Button, Card, ListGroup, InputGroup } from 'react-bootstrap';

const socket = io('http://localhost:5000');

const Chat = ({ user, setUser }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('');

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

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && recipient.trim()) {
      const newMessage = { sender: user, recipient, content: message };
      socket.emit('sendMessage', newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Card style={{ width: '600px', height: '80vh', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Card.Title>Chat as {user}</Card.Title>
          <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
        </div>
        <ListGroup variant="flush" style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
          {messages.map((msg, index) => (
            <ListGroup.Item key={index} className={msg.sender === user ? 'text-end' : 'text-start'}>
              <strong>{msg.sender}:</strong> {msg.content}
            </ListGroup.Item>
          ))}
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