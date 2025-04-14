const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      res.status(200).json({ username: user.username, profilePhoto: user.profilePhoto });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/update-profile', async (req, res) => {
  const { username, profilePhoto } = req.body;
  console.log('Updating profile for username:', username);
  if (!username || !profilePhoto) {
    return res.status(400).json({ message: 'Username and profile photo are required' });
  }
  try {
    const user = await User.findOneAndUpdate(
      { username },
      { profilePhoto },
      { new: true }
    );
    if (user) {
      res.status(200).json({ message: 'Profile updated', profilePhoto: user.profilePhoto });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;