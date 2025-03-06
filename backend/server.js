require("dotenv").config();
const express = require("express");


const path = require('path');
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const StationRoutes = require("./routes/StationRoutes");
// const verifyToken = require("./middleware/authMiddleware");
const ReservationRoutes = require("./routes/ReservationRoutes");
const reportRoutes = require("./routes/reportRoutes");
const updateRoutes = require("./routes/updateRoutes");
// const favRoutes = require("./routes/FavstationRoutes");

// const favoriteRoutes = require("./routes/FavstationRoutes");

const app = express();

// Serve static files from the React app
// app.use(express.static(path.join(__dirname, 'public')));

// // For any route, return the index.html file to allow React to handle routing
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/users", userRoutes);
app.use('/api/stations', StationRoutes);
app.use("/api/reservations", ReservationRoutes);
app.use("/api/update", updateRoutes);
app.use("/api/report", reportRoutes);
// app.use("/api/favorites", favRoutes);
// app.use('/api', favoriteRoutes);


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
