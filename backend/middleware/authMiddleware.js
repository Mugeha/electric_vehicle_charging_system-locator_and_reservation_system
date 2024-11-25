const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Adjust the path if necessary

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", ""); // Extract token and remove "Bearer " prefix
  console.log("Authorization Header:", req.header("Authorization")); // Debugging log
  console.log("Extracted Token:", token); // Debugging log

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // Debugging log

    // Check if user exists in the database
    const user = await User.findById(decoded.user?.id || decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user info to request for further processing
    req.user = { id: user._id, name: user.name, email: user.email };

    next(); // Continue to the next middleware/route handler
  } catch (err) {
    console.error("JWT Verification Error:", err.message); // Debugging log
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
