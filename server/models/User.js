const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: String,
  password: String, // In a real app, hash passwords
});
module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  profilePhoto: { type: String, default: '' }, // Store as base64 or URL
});
module.exports = mongoose.model('User', userSchema);