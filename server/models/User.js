const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  profilePhoto: { type: String, default: '' },
});
module.exports = mongoose.model('User', userSchema);