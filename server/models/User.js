const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: String,
  password: String, // In a real app, hash passwords
});
module.exports = mongoose.model('User', userSchema);