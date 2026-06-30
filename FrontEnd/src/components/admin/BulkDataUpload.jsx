import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./BulkDataUpload.css";

const BulkDataUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
      setResults(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setUploading(true);
    setProgress(0);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setProgress(percentCompleted);
        },
      };

      const response = await axios.post(
        "http://localhost:8081/api/data/bulk-upload",
        formData,
        config,
      );

      setResults(response.data);
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const generateSampleCSV = () => {
    const headers = [
      "applicantName",
      "email",
      "phoneNumber",
      "propertyPrice",
      "downPayment",
      "interestRate",
      "loanTermYears",
      "annualIncome",
      "monthlyDebt",
      "employmentStatus",
      "creditScore",
      "propertyType",
      "propertyAddress",
    ];

    const sampleRow = [
      "John Doe",
      "john@example.com",
      "+1 555-123-4567",
      "500000",
      "100000",
      "6.5",
      "30",
      "120000",
      "2000",
      "FULL_TIME",
      "720",
      "SINGLE_FAMILY",
      "123 Main St, NY",
    ];

    const csvContent = headers.join(",") + "\n" + sampleRow.join(",");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_mortgage_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bulk-upload-page">
      <div className="bulk-upload-header">
        <h1 className="bulk-title">📤 Bulk Data Upload</h1>
        <p className="bulk-subtitle">
          Upload multiple mortgage applications at once
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bulk-upload-card glass"
      >
        <div className="upload-zone" onDragOver={(e) => e.preventDefault()}>
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            accept=".json,.csv"
            className="file-input-hidden"
          />
          <label htmlFor="file-upload" className="upload-label">
            <span className="upload-icon">📁</span>
            <span className="upload-text">
              {file ? `📄 ${file.name}` : "Drop files here or click to browse"}
            </span>
            <span className="upload-supported">Supported: JSON, CSV</span>
          </label>
        </div>

        {error && (
          <div className="upload-error">
            <span className="error-icon">❌</span>
            {error}
          </div>
        )}

        {uploading && (
          <div className="progress-wrapper">
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="progress-text">{progress}% uploaded</span>
          </div>
        )}

        <div className="upload-actions">
          <button className="btn-secondary" onClick={generateSampleCSV}>
            📥 Download CSV Sample
          </button>
          <button
            className="btn-primary"
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? "⏳ Uploading..." : "🚀 Upload Data"}
          </button>
        </div>

        {results && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="upload-results"
          >
            <h4 className="results-title">✅ Upload Complete!</h4>
            <div className="results-grid">
              <div className="result-card total">
                <span className="result-label">Total Records</span>
                <span className="result-value">{results.total}</span>
              </div>
              <div className="result-card success">
                <span className="result-label">✅ Success</span>
                <span className="result-value">{results.success}</span>
              </div>
              <div className="result-card failed">
                <span className="result-label">❌ Failed</span>
                <span className="result-value">{results.failed || 0}</span>
              </div>
            </div>
            {results.errors && results.errors.length > 0 && (
              <div className="error-details">
                <h5>Error Details:</h5>
                <div className="error-scroll">
                  {results.errors.map((err, i) => (
                    <p key={i} className="error-line">
                      • {err}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      <div className="bulk-tips glass">
        <h4>💡 Tips for Bulk Upload</h4>
        <ul>
          <li>📄 Use CSV format for large datasets</li>
          <li>🔍 All fields are validated before saving</li>
          <li>📝 Errors are logged for failed records</li>
          <li>⚡ Progress bar shows upload status</li>
        </ul>
      </div>
    </div>
  );
};

export default BulkDataUpload;
