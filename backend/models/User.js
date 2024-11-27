const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    // Username (unique and required, fetched from profile or generated)
    userName: { type: String, required: true, unique: true },
    // Profile Picture URL
    profilePicture: { type: String, default: null },

    // Country (optional)
    country: { type: String, default: null },

    // Postal Code (optional)
    postalCode: { type: String, default: null },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Station' }]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
