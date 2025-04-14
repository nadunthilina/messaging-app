const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.get('/:user', async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.params.user }, { recipient: req.params.user }],
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  const { sender, recipient, content } = req.body;
  try {
    const message = new Message({ sender, recipient, content });
    await message.save();
    res.status(201).json({ message: 'Message sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;