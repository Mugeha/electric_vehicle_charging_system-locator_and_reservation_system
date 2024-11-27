const { Parser } = require("json2csv");
const Reservation = require("../models/Reservations"); // Import the Reservation model

/**
 * JSON endpoint to provide aggregated data for the frontend
 */
const getReportSummary = async (req, res) => {
  try {
    // Fetch reservations specific to the authenticated user
    const reservations = await Reservation.find({ userId: req.user.id });
    
    if (!reservations || reservations.length === 0) {
      return res.status(404).json({ message: "No reservations found." });
    }

    // Compute aggregated statistics
    const totalReservations = reservations.length;
    const totalDuration = reservations.reduce((sum, r) => sum + (r.duration || 0), 0); // Ensure duration exists
    const avgDuration = totalReservations > 0 ? totalDuration / totalReservations : 0;

    const stationSummary = reservations.reduce((acc, curr) => {
      const station = curr.stationName;
      if (!acc[station]) {
        acc[station] = { count: 0, totalDuration: 0 };
      }
      acc[station].count += 1;
      acc[station].totalDuration += curr.duration || 0; // Ensure duration exists
      return acc;
    }, {});

    // Send aggregated report as JSON
    res.json({
      totalReservations,
      totalDuration,
      avgDuration,
      stationSummary,
    });
  } catch (err) {
    console.error("Error generating report summary:", err.message);
    res.status(500).json({ message: "Failed to generate report summary." });
  }
};

/**
 * CSV endpoint for downloading the report
 */
const downloadReport = async (req, res) => {
  try {
    // Fetch reservations specific to the authenticated user
    const reservations = await Reservation.find({ userId: req.user.id });

    if (!reservations || reservations.length === 0) {
      return res.status(404).json({ message: "No reservations found for report generation." });
    }

    // Define fields for CSV export
    const fields = [
      { label: "Station Name", value: "stationName" },
      { label: "Car Model", value: "carModel" },
      { label: "Car Plate Number", value: "carPlateNumber" },
      { label: "Day", value: "day" },
      { label: "Time", value: "time" },
    ];

    // Convert JSON to CSV
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(reservations);

    // Send the CSV file as a download
    res.header("Content-Type", "text/csv");
    res.attachment("reservations_report.csv");
    res.send(csv);
  } catch (err) {
    console.error("Error generating CSV report:", err.message);
    res.status(500).json({ message: "Failed to generate CSV report." });
  }
};

module.exports = {
  getReportSummary,
  downloadReport,
};
