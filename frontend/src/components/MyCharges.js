import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";  // Import Toastify
import "react-toastify/dist/ReactToastify.css";  // Import Toastify styles
import "./report.css";

const MyCharges = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("No token found. Please log in.");  // Show error toast
          setLoading(false);
          return;
        }

        // Fetch report data from the backend with date filters
        const response = await axios.get(
          "http://localhost:5000/api/report/summary?startDate=2007-01-01&endDate=2024-12-31",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReport(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching report:", err.message);
        toast.error("Failed to fetch report.");  // Show error toast
        setError("Failed to fetch report.");
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  // Handle CSV download
  const handleDownloadCSV = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found. Please log in.");  // Show error toast
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/report/download",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Important to handle CSV download
        }
      );

      // Create a Blob from the CSV data
      const blob = new Blob([response.data], { type: "text/csv" });

      // Create an anchor element and download the CSV
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "reservations_report.csv";
      link.click();
    } catch (err) {
      console.error("Error downloading CSV:", err.message);
      toast.error("Failed to download CSV report.");  // Show error toast
    }
  };

  if (loading) return <p>Loading report...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
    <div className="report">
      <h2>Charging Report</h2>
      <p>
        <strong>Total Reservations:</strong> {report.totalReservations || 0}
      </p>
      <p>
        <strong>Total Duration:</strong> {report.totalDuration || 0} minutes
      </p>
      <p>
        <strong>Average Duration:</strong>{" "}
        {report.avgDuration !== undefined
          ? report.avgDuration.toFixed(2)
          : "N/A"}{" "}
        minutes
      </p>

      <h3>Reservations by Station</h3>
      {report.stationSummary ? (
        <>
        <ul>
          {Object.entries(report.stationSummary).map(([station, data]) => (
            <>
            <li key={station}>
              <p>
                <strong>{station}</strong>
              </p>
              <p>Reservations: {data.count || 0}</p>
              <p>Total Duration: {data.totalDuration || 0} minutes</p>
            </li>
                <hr></hr>
                </>
          ))}
        </ul>
    
        </>
      ) : (
        <p>No station data available.</p>
      )}

      <button
        onClick={handleDownloadCSV}
        style={{
          backgroundColor: "green",
          color: "white",
          border: "none",
          padding: "10px 15px",
          cursor: "pointer",
          margin: "10px 0",
        }}
      >
        Download CSV Report
      </button>
    </div>
    </>
  );
};

export default MyCharges;
