import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import "./Applications.css";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: token } };
      const response = await axios.get(
        "http://localhost:8081/api/mortgage/applications",
        config,
      );
      setApplications(response.data);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const filteredApps =
    filter === "all"
      ? applications
      : applications.filter(
          (app) => app.applicationStatus?.toLowerCase() === filter,
        );

  return (
    <div className="applications-page">
      <div className="applications-container">
        <div className="applications-header">
          <div>
            <h1 className="applications-title">📋 My Applications</h1>
            <p className="applications-subtitle">
              Track all your mortgage applications in one place
            </p>
          </div>
          <Link to="/apply" className="btn-primary">
            New Application
          </Link>
        </div>

        <div className="filter-bar">
          {["all", "pending", "pending_review", "approved", "denied"].map(
            (status) => (
              <button
                key={status}
                className={`filter-btn ${filter === status ? "active" : ""}`}
                onClick={() => setFilter(status)}
              >
                {status === "all" ? "All" : status.replace("_", " ")}
              </button>
            ),
          )}
        </div>

        <div className="applications-list">
          {loading ? (
            <div className="loading-skeleton">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-card glass">
                  <div className="skeleton-row"></div>
                  <div className="skeleton-row short"></div>
                </div>
              ))}
            </div>
          ) : filteredApps.length > 0 ? (
            filteredApps.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="application-item glass"
              >
                <Link
                  to={`/application/${app.id}`}
                  className="application-link"
                >
                  <div className="app-main-info">
                    <div className="app-name-status">
                      <span className="app-name">
                        {app.applicantName || "N/A"}
                      </span>
                      <span
                        className={`status-badge ${getStatusColor(app.applicationStatus)}`}
                      >
                        {app.applicationStatus || "PENDING"}
                      </span>
                    </div>
                    <div className="app-details">
                      <span className="app-detail">
                        ${app.propertyPrice?.toLocaleString() || "N/A"}
                      </span>
                      <span className="app-detail-separator">·</span>
                      <span className="app-detail">
                        {app.loanTermYears || "N/A"} years
                      </span>
                      <span className="app-detail-separator">·</span>
                      <span className="app-detail">
                        {app.interestRate || "N/A"}%
                      </span>
                    </div>
                  </div>
                  <div className="app-meta">
                    <span className="app-date">
                      {app.createdAt
                        ? new Date(app.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                    <span className="app-arrow">→</span>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="empty-state glass">
              <span className="empty-icon">📋</span>
              <p className="empty-text">No applications found</p>
              <Link to="/apply" className="btn-secondary btn-sm">
                Start Your First Application
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Applications;
