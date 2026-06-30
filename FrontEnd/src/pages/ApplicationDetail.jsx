import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import MortgagePrediction from "../components/ml/MortgagePrediction";
import "./ApplicationDetail.css";

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplication = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const config = { headers: { Authorization: token } };
      const response = await axios.get(
        `http://localhost:8081/api/mortgage/${id}`,
        config,
      );
      setApplication(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError("Application not found");
      }
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "status-approved";
      case "denied":
        return "status-denied";
      case "pending_review":
        return "status-pending_review";
      case "pending":
        return "status-pending";
      default:
        return "status-pending";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "✅";
      case "denied":
        return "❌";
      case "pending_review":
        return "⏳";
      case "pending":
        return "📋";
      default:
        return "📋";
    }
  };

  const formatCurrency = (value) => {
    if (!value) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="detail-page">
        <div className="detail-container">
          <div className="loading-skeleton">
            <div className="skeleton-card glass">
              <div className="skeleton-row"></div>
              <div className="skeleton-row"></div>
              <div className="skeleton-row"></div>
              <div className="skeleton-row short"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="detail-page">
        <div className="detail-container">
          <div className="error-state glass">
            <span className="error-icon-large">🔍</span>
            <h3>Application Not Found</h3>
            <p>
              {error || "We couldn't find the application you're looking for."}
            </p>
            <button
              onClick={() => navigate("/applications")}
              className="btn-primary"
            >
              Back to Applications{" "}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <div className="detail-container">
        <div className="detail-header">
          <button
            onClick={() => navigate("/applications")}
            className="back-btn"
          >
            ← Back to Applications
          </button>
          <span
            className={`status-badge large ${getStatusColor(application.applicationStatus)}`}
          >
            {getStatusIcon(application.applicationStatus)}
            {application.applicationStatus || "PENDING"}
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="detail-card glass"
        >
          <div className="detail-grid">
            <div className="detail-section">
              <h4 className="detail-section-title">Applicant Information</h4>
              <div className="detail-item">
                <span className="detail-label">Name</span>
                <span className="detail-value">
                  {application.applicantName || "N/A"}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-value">
                  {application.email || "N/A"}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone</span>
                <span className="detail-value">
                  {application.phoneNumber || "N/A"}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Employment</span>
                <span className="detail-value">
                  {application.employmentStatus?.replace("_", " ") || "N/A"}
                </span>
              </div>
            </div>

            <div className="detail-section">
              <h4 className="detail-section-title">Property Details</h4>
              <div className="detail-item">
                <span className="detail-label">Address</span>
                <span className="detail-value">
                  {application.propertyAddress || "N/A"}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Property Type</span>
                <span className="detail-value">
                  {application.propertyType?.replace("_", " ") || "N/A"}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Property Price</span>
                <span className="detail-value">
                  {formatCurrency(application.propertyPrice)}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Down Payment</span>
                <span className="detail-value">
                  {formatCurrency(application.downPayment)}
                </span>
              </div>
            </div>

            <div className="detail-section">
              <h4 className="detail-section-title">Loan Details</h4>
              <div className="detail-item">
                <span className="detail-label">Loan Amount</span>
                <span className="detail-value">
                  {formatCurrency(application.loanAmount)}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Interest Rate</span>
                <span className="detail-value">
                  {application.interestRate || "N/A"}%
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Loan Term</span>
                <span className="detail-value">
                  {application.loanTermYears || "N/A"} years
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Monthly Payment</span>
                <span className="detail-value highlight">
                  {formatCurrency(application.monthlyPayment)}
                </span>
              </div>
            </div>

            <div className="detail-section">
              <h4 className="detail-section-title">Financial Profile</h4>
              <div className="detail-item">
                <span className="detail-label">Annual Income</span>
                <span className="detail-value">
                  {formatCurrency(application.annualIncome)}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Monthly Debt</span>
                <span className="detail-value">
                  {formatCurrency(application.monthlyDebt)}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Credit Score</span>
                <span className="detail-value">
                  {application.creditScore || "N/A"}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">DTI Ratio</span>
                <span className="detail-value">
                  {application.debtToIncomeRatio
                    ? `${(application.debtToIncomeRatio * 100).toFixed(1)}%`
                    : "N/A"}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Submitted</span>
                <span className="detail-value">
                  {application.createdAt
                    ? new Date(application.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* AI Prediction Section */}
          <MortgagePrediction applicationId={application.id} />

          {application.aiRecommendation && (
            <div className="ai-section">
              <div className="ai-header">
                <span className="ai-icon">🤖</span>
                <span className="ai-title">AI Recommendation</span>
                <span className="ai-score">
                  Confidence:{" "}
                  {application.aiConfidenceScore?.toFixed(0) || "N/A"}%
                </span>
              </div>
              <p className="ai-text">{application.aiRecommendation}</p>
            </div>
          )}

          <div className="detail-actions">
            <button className="btn-secondary" onClick={() => window.print()}>
              📄 Download Report
            </button>
            <button
              className="btn-primary"
              onClick={() =>
                (window.location.href = "mailto:support@mortgage.io")
              }
            >
              💬 Contact Support
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ApplicationDetail;
