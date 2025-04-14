const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT"]
  }
});

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/messaging-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const messageRoutes = require('./routes/message');
app.use('/api/messages', messageRoutes);

// Socket.io for real-time messaging
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('sendMessage', async (message) => {
    try {
      const { sender, recipient, content } = message;
      const Message = require('./models/Message');
      const newMessage = new Message({ sender, recipient, content });
      await newMessage.save();
      io.emit('message', message);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));