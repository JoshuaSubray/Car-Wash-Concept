const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  // ...existing code...
  email: {
    type: String,
    required: true,
    unique: true,
    index: true // Ensure email field is indexed
  },
  // ...existing code...
});

const User = mongoose.model('User', userSchema);
module.exports = User;