io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('sendMessage', async (message) => {
    try {
      const { sender, recipient, content } = message;
      const newMessage = new Message({ sender, recipient, content });
      await newMessage.save(); // Save to MongoDB
      io.emit('message', message); // Broadcast to all clients
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

mongoose.connect('mongodb://localhost:27017/messaging-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});