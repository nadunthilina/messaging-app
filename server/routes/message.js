const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.get('/:user', async (req, res) => {
  const messages = await Message.find({
    $or: [{ sender: req.params.user }, { recipient: req.params.user }],
  }).sort({ timestamp: 1 });
  res.json(messages);
});

router.post('/', async (req, res) => {
  const { sender, recipient, content } = req.body;
  const message = new Message({ sender, recipient, content });
  await message.save();
  res.status(201).send('Message sent');
});

module.exports = router;