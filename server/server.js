const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//Connect to MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/messaging-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const messageRoutes = require('./routes/message');
app.use('/api/messages', messageRoutes);
//Set Up Socket.io for Real-time Messaging
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('sendMessage', (message) => {
    io.emit('message', message);
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});