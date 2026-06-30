import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalApplications: 0,
    approved: 0,
    pending: 0,
    pending_review: 0,
    denied: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: token } };

      const [statsRes, appsRes] = await Promise.all([
        axios.get("http://localhost:8081/api/mortgage/stats", config),
        axios.get("http://localhost:8081/api/mortgage/recent", config),
      ]);

      setStats(statsRes.data);
      setRecentApplications(appsRes.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: "Total Applications",
      value: stats.totalApplications,
      icon: "📋",
      color: "#00d4ff",
    },
    { label: "Approved", value: stats.approved, icon: "✅", color: "#00e676" },
    {
      label: "Pending Review",
      value: stats.pending_review || stats.pending,
      icon: "⏳",
      color: "#ffd93d",
    },
    { label: "Denied", value: stats.denied, icon: "❌", color: "#ff6b6b" },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">📊 Dashboard</h1>
            <p className="dashboard-subtitle">
              Welcome back! Here's an overview of your mortgage applications.
            </p>
          </div>
          <Link to="/apply" className="btn-primary">
            New Application
            <span className="btn-arrow">+</span>
          </Link>
        </div>

        <div className="stats-grid">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="stat-card-glass glass"
              style={{ "--stat-color": stat.color }}
            >
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-info">
                <span className="stat-value">
                  {loading ? "..." : stat.value}
                </span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="recent-section">
          <h2 className="section-title-small">Recent Applications</h2>
          <div className="recent-list glass">
            {loading ? (
              <div className="loading-skeleton">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton-row"></div>
                ))}
              </div>
            ) : recentApplications.length > 0 ? (
              recentApplications.map((app, index) => (
                <Link
                  to={`/application/${app.id}`}
                  key={index}
                  className="recent-item"
                >
                  <div className="recent-info">
                    <span className="recent-name">{app.applicantName}</span>
                    <span className="recent-details">
                      ${app.propertyPrice?.toLocaleString()} ·{" "}
                      {app.loanTermYears} years
                    </span>
                  </div>
                  <div className="recent-status">
                    <span
                      className={`status-badge status-${app.applicationStatus?.toLowerCase()}`}
                    >
                      {app.applicationStatus || "PENDING"}
                    </span>
                    <span className="recent-date">
                      {app.createdAt
                        ? new Date(app.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="empty-state">
                <span className="empty-icon">📭</span>
                <p className="empty-text">No applications yet</p>
                <Link to="/apply" className="btn-secondary btn-sm">
                  Start Your First Application
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
