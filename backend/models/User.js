const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Station' }]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
