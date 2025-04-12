import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Chat = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await axios.get(`http://localhost:5000/api/messages/${user}`);
      setMessages(response.data);
    };
    fetchMessages();

    socket.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => socket.off('message');
  }, [user]);

  const sendMessage = () => {
    const newMessage = { sender: user, recipient, content: message };
    socket.emit('sendMessage', newMessage);
    setMessage('');
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Recipient" />
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;