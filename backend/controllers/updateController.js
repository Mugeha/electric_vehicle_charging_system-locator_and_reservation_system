const User = require("../models/User");

const updateUser = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `authMiddleware` attaches user info to `req.user`
    const { name, email, country, postalCode } = req.body;

    // Validate inputs (optional, for better user feedback)
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Find the user and update the fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, country, postalCode },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the updated user
    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        country: updatedUser.country,
        postalCode: updatedUser.postalCode,
      },
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { updateUser };
