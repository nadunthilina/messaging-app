const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.get('/:user', async (req, res) => {
  try {
    const user = req.params.user.toLowerCase();
    const messages = await Message.find({
      $or: [{ sender: user }, { recipient: user }],
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  const { sender, recipient, content } = req.body;
  try {
    const message = new Message({ sender: sender.toLowerCase(), recipient: recipient.toLowerCase(), content });
    await message.save();
    res.status(201).json({ message: 'Message sent' });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;