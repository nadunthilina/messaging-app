const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  console.log('Register request:', { username, password });
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  try {
    const normalizedUsername = username.toLowerCase();
    const existingUser = await User.findOne({ username: normalizedUsername });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const user = new User({ username: normalizedUsername, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login request:', { username, password });
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  try {
    const normalizedUsername = username.toLowerCase();
    const user = await User.findOne({ username: normalizedUsername, password });
    if (user) {
      res.status(200).json({ username: user.username, profilePhoto: user.profilePhoto });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

router.put('/update-profile', async (req, res) => {
  const { username, profilePhoto } = req.body;
  console.log('Update profile request:', { username });
  if (!username || !profilePhoto) {
    return res.status(400).json({ message: 'Username and profile photo are required' });
  }
  try {
    const normalizedUsername = username.toLowerCase();
    const user = await User.findOneAndUpdate(
      { username: normalizedUsername },
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
    res.status(500).json({ message: 'Server error during profile update' });
  }
});

module.exports = router;