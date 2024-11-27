const express = require("express");
const { getReportSummary, downloadReport } = require("../controllers/myChargesController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// JSON report summary for the frontend
router.get("/summary", authMiddleware, getReportSummary);

// CSV download endpoint
router.get("/download", authMiddleware, downloadReport);

module.exports = router;
